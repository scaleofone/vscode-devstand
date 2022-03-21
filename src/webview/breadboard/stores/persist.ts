import { Writable, writable, get } from 'svelte/store'
import { records } from './breadboard'
import { extension } from '../transport'

import { AbortablePromise } from '../../../AbortablePromise'
import { Record, Component } from '../../../BreadboardTypes'

export const unPersistedRecords: Writable<Record[]> = writable([])
export const inputValues: Writable<any> = writable([])

export function rememberUnPersistedRecordsBeforeHydrate() {
    if (get(unPersistedRecords).length == 0) {
        rememberUnPersistedRecordsExcept([])
    }
}

export function getUnPersistedRecordsBeforeHydrate(persistedRecords: Record[]) {
    return get(unPersistedRecords).filter(record => {
        let persistedPaths = persistedRecords.map(r => r.path)
        let recordPath = (record.path.match(/temporaryIdentifier_\d*$/))
            ? record.path.replace(/temporaryIdentifier_\d*$/, record.identifier)
            : record.path
        if (persistedPaths.includes(recordPath)) {
            console.log('WAS PERSISTED', record)
            return false
        }
        return true
    })
}

function rememberUnPersistedRecordsExcept(exceptPaths: string[]) {
    unPersistedRecords.set(
        JSON.parse(JSON.stringify(
            get(records).filter(r => ! r.persisted && ! exceptPaths.includes(r.path))
        ))
    )
}

export function removeRecordIfNotPersisted(record: Record) {
    if (! record.persisted) {
        let scope = record.scope
        let componentIdentifier = record.componentIdentifier
        records.update(records => records.filter(r => {
            if (r.path == record.path) { return false }
            if (r.componentIdentifier == componentIdentifier && r.identifier == scope && ! r.persisted) { return false }
            return true
        }))
    }
}

export function persistRecord(record: Record): AbortablePromise<void> {
    let foundRecord = get(records).find(r => r.path == record.path)
    if (foundRecord) {
        foundRecord.identifier = record.identifier
        foundRecord.value = record.value
    }
    let scopeRecord = get(records).find(r => record.scope && r.componentIdentifier == record.componentIdentifier && r.identifier == record.scope && ! r.persisted)
    if (scopeRecord) {

        if (record.type == 'string' || record.type == 'number' || record.type == 'reference' || record.type == 'concatenation') {
            rememberUnPersistedRecordsExcept([scopeRecord.path, record.path])
            return extension.createScopeWithRecords({
                componentIdentifier: record.componentIdentifier,
                scopeIdentifier: scopeRecord.identifier,
                records: [{
                    identifier: record.identifier,
                    value: record.value,
                    type: record.type,
                }]
            })
        } else {
            throw 'Can not invoke extension.createScopeWithRecords for Record[type='+record.type+']'
        }

    } else {
        if (record.type == 'string' || record.type == 'number' || record.type == 'null' || record.type == 'object') {
            rememberUnPersistedRecordsExcept([record.path])
            return extension.createRecordValue({
                componentIdentifier: record.componentIdentifier,
                recordScope: record.scope,
                recordIdentifier: record.identifier,
                recordValue: record.value,
                recordType: record.type,
            })
        } else {
            throw 'Can not invoke extension.createRecordValue for Record[type='+record.type+']'
        }
    }
}

export function makeUnPersistedRecords(component: Component, recordIdentifier: string, alreadyAdded: boolean, recordSchema: object): Record[] {
    let type = ((typeof recordSchema == 'object' && typeof recordSchema['type'] == 'string' && ['object', 'string', 'number'].includes(recordSchema['type'].toLowerCase())) ? recordSchema['type'].toLowerCase() : 'null') as 'object' | 'string' | 'number' | 'null'
    let value = (typeof recordSchema == 'object' && ['object', 'string', 'number'].includes(typeof recordSchema['default'])) ? recordSchema['default'] : null

    if (alreadyAdded && type != 'object') return

    let scope = '' // TODO define scope while adding Records
    function makeShortScope(scope: string): string {
        return ''
    }

    if (type == 'object' && recordIdentifier == 'env') {
        let records: Record[] = []

        if (! alreadyAdded) {
            records.push({
                persisted: false,
                componentIdentifier: component.identifier,
                scope,
                shortScope: makeShortScope(scope),
                identifier: recordIdentifier,
                path: ['$', component.identifier, scope, recordIdentifier].filter(n=>n).join('.'),
                type,
                value,
                inSchema: true,
            })
        }
        let innerRecordIdentifier = 'temporaryIdentifier_' + Math.random().toString().substring(2)
        records.push({
            persisted: false,
            componentIdentifier: component.identifier,
            scope: 'env',
            shortScope: makeShortScope(scope),
            identifier: '',
            path: ['$', component.identifier, scope, recordIdentifier, innerRecordIdentifier].filter(n=>n).join('.'),
            type: 'string',
            value: '',
            inSchema: true,
        })
        return records
    }

    let record: Record = {
        persisted: false,
        componentIdentifier: component.identifier,
        scope,
        shortScope: makeShortScope(scope),
        identifier: recordIdentifier,
        path: ['$', component.identifier, scope, recordIdentifier].filter(n=>n).join('.'),
        type,
        value,
        inSchema: true,
    }
    return [record]
}
