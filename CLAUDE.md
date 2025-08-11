# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WEBGALPI is a Chrome extension for webpage highlighting and bookmarking. It allows users to highlight text on web pages, save highlights to a dashboard, and manage their bookmarks with Google Drive backup/restore functionality. The extension supports Korean, English, and Japanese languages.

## Architecture

### Core Structure

- **Vue.js 2** frontend with **Vuetify** UI components
- **Chrome Extension Manifest V2** with content scripts, background scripts, and popup
- **Webpack** build system with hot module replacement support
- **IndexedDB** for local data storage
- **Google Drive API** integration for backup/restore

### Key Components

- `src/contents/core/hl-core.js` - Core highlighting functionality that wraps selected text in highlight spans
- `src/dashboard/DashboardApp.vue` - Main dashboard application for managing highlights and bookmarks
- `src/popup/PopupApp.vue` - Extension popup with tabs for site info and highlighting
- `src/background/` - Background scripts for context menus, storage, and cross-tab communication
- `src/common/` - Shared utilities including Google Drive integration and database operations

### Database Layer

- `src/database/` - IndexedDB wrapper with DDL queries and connection management
- Local storage for highlights, bookmarks, and user preferences
- Google Drive sync for data backup and cross-device synchronization

## Development Commands

```bash
# Build for production
npm run build

# Build for development
npm run build:dev

# Watch mode for development
npm run watch:dev

# Create extension zip file
npm run build-zip

# Code quality
npm run lint
npm run prettier:write
```

## Content Script Architecture

The extension injects multiple content scripts:

- `contents/listener.js` - Event listeners and message passing
- `contents/core/hl-core.js` - Text highlighting engine
- CSS files for highlight styling

## Extension Structure

- **Background Page**: Handles context menus, storage events, and cross-tab communication
- **Content Scripts**: Inject highlighting functionality into web pages
- **Popup**: Quick access interface with site info and highlight management
- **Dashboard**: Full-featured management interface accessible via extension icon
- **Options**: Extension settings and preferences

## Build Output

Webpack builds to `dist/` directory with:

- Minified JS bundles for each component
- CSS extraction for styling
- Asset copying for icons, locales, and HTML files
- Manifest processing for extension metadata
