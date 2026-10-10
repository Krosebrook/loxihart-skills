#!/usr/bin/env node
/**
 * build-tokens.js — Style Dictionary build script
 * 
 * Transforms design tokens from JSON source of truth into
 * platform-specific outputs (CSS, JS/TS, iOS, Android).
 * 
 * Usage:
 *   node scripts/build-tokens.js [--config path/to/config.json]
 * 
 * Expects tokens in tokens/ directory:
 *   tokens/colors.json
 *   tokens/spacing.json
 *   tokens/typography.json
 *   tokens/shadows.json
 *   tokens/borders.json
 * 
 * Outputs:
 *   dist/tokens/variables.css     (CSS custom properties)
 *   dist/tokens/tokens.js         (ES6 constants)
 *   dist/tokens/tokens.d.ts       (TypeScript declarations)
 *   dist/tokens/ios/StyleDictionary.swift
 *   dist/tokens/android/colors.xml
 */

const StyleDictionary = require('style-dictionary');
const path = require('path');

const configPath = process.argv.includes('--config')
  ? process.argv[process.argv.indexOf('--config') + 1]
  : null;

const config = configPath
  ? require(path.resolve(configPath))
  : {
      source: ['tokens/**/*.json'],
      platforms: {
        css: {
          transformGroup: 'css',
          buildPath: 'dist/tokens/',
          files: [
            {
              destination: 'variables.css',
              format: 'css/variables',
              options: { outputReferences: true },
            },
          ],
        },
        js: {
          transformGroup: 'js',
          buildPath: 'dist/tokens/',
          files: [
            {
              destination: 'tokens.js',
              format: 'javascript/es6',
            },
          ],
        },
        ts: {
          transformGroup: 'js',
          buildPath: 'dist/tokens/',
          files: [
            {
              destination: 'tokens.d.ts',
              format: 'typescript/es6-declarations',
            },
          ],
        },
        ios: {
          transformGroup: 'ios-swift',
          buildPath: 'dist/tokens/ios/',
          files: [
            {
              destination: 'StyleDictionary.swift',
              format: 'ios-swift/class.swift',
              className: 'StyleDictionary',
            },
          ],
        },
        android: {
          transformGroup: 'android',
          buildPath: 'dist/tokens/android/',
          files: [
            {
              destination: 'colors.xml',
              format: 'android/colors',
            },
          ],
        },
      },
    };

console.log('Building design tokens...');
console.log(`Source: ${config.source}`);

try {
  const sd = StyleDictionary.extend(config);
  sd.buildAllPlatforms();
  console.log('\n✅ Tokens built successfully');
  console.log('Outputs:');
  Object.entries(config.platforms).forEach(([platform, cfg]) => {
    cfg.files.forEach((file) => {
      console.log(`  ${cfg.buildPath}${file.destination}`);
    });
  });
} catch (error) {
  console.error(`\n❌ Token build failed: ${error.message}`);
  process.exit(1);
}
