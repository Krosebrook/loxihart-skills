import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


spec = importlib.util.spec_from_file_location("patch_tonone", Path(__file__).with_name("patch_tonone.py"))
patch_tonone = importlib.util.module_from_spec(spec)
spec.loader.exec_module(patch_tonone)


class LegacyHooksTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.vendor = Path(self.tmp.name)
        marketplace = self.vendor / ".claude-plugin" / "marketplace.json"
        marketplace.parent.mkdir()
        marketplace.write_text('{"plugins": []}\n')
        self.hooks = self.vendor / "team" / "example" / "hooks" / "hooks.json"
        self.hooks.parent.mkdir(parents=True)

    def test_check_apply_and_idempotence(self):
        content = '{"hooks": [{"event": "post_install", "command": "setup"}]}\n'
        self.hooks.write_text(content)
        dest = self.hooks.with_name("post-install.upstream.json")
        self.assertEqual(patch_tonone.apply(self.vendor, check=True), 1)
        self.assertTrue(self.hooks.exists())
        self.assertFalse(dest.exists())
        self.assertEqual(patch_tonone.apply(self.vendor), 0)
        self.assertFalse(self.hooks.exists())
        self.assertEqual(dest.read_text(), content)
        self.assertEqual(patch_tonone.apply(self.vendor, check=True), 0)
        self.assertEqual(patch_tonone.apply(self.vendor), 0)

    def test_existing_destination_conflict_fails_without_changes(self):
        self.hooks.write_text('{"hooks": [{"event": "post_install"}]}\n')
        dest = self.hooks.with_name("post-install.upstream.json")
        dest.write_text("different\n")
        with self.assertRaises(SystemExit):
            patch_tonone.apply(self.vendor)
        self.assertTrue(self.hooks.exists())
        self.assertEqual(dest.read_text(), "different\n")

    def test_other_hooks_are_not_relocated(self):
        for hooks in ({"PreToolUse": []}, [{"event": "SessionStart"}],
                      [{"event": "post_install"}, {"event": "PreToolUse"}], []):
            with self.subTest(hooks=hooks):
                self.hooks.write_text(json.dumps({"hooks": hooks}))
                self.assertEqual(patch_tonone.relocate_legacy_hooks(self.vendor), [])

    def test_post_install_with_agent_prompt_is_preserved(self):
        content = json.dumps({"hooks": [
            {"event": "post_install"},
            {"event": "PostToolUse", "tool": "Agent", "prompt": "update changelog"},
        ]})
        self.hooks.write_text(content)
        self.assertEqual(patch_tonone.apply(self.vendor), 0)
        self.assertEqual(self.hooks.with_name("post-install.upstream.json").read_text(), content)

    def test_identical_destination_is_preserved(self):
        content = '{"hooks": [{"event": "post_install"}]}\n'
        self.hooks.write_text(content)
        dest = self.hooks.with_name("post-install.upstream.json")
        dest.write_text(content)
        self.assertEqual(patch_tonone.apply(self.vendor), 0)
        self.assertFalse(self.hooks.exists())
        self.assertEqual(dest.read_text(), content)


if __name__ == "__main__":
    unittest.main()
