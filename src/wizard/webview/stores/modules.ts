import { derived, Readable, readable, Writable, writable, get } from 'svelte/store'

import { selectedBase } from './base'
import { allModules } from './dictionaries'

export const builtinModules: Readable<string[]> = derived(selectedBase, ($selectedBase) => $selectedBase?.builtinModules || [])

export const detectedComposerModules: Writable<string[]> = writable(['dom','fileinfo','json','libxml','mbstring','openssl','pcre','simplexml','tokenizer'])

export const manualModules: Readable<string[]> = readable(['iconv', 'pcntl'])
