import vscode from 'vscode'
import { TemplateImport } from './Breadboard'

export default async function(): Promise<TemplateImport[]> {

    // TODO actually find libsonnet files
    // найти все libsonnet файлы, исключить директорию k8s-libsonnet, исключить symlink-и (брать только symlink-и ???)
    // прочитать файл, взять только те, внутри которых есть строка "libraryMeta"
    // сделать файлу eval
    // если вернется [libraryMeta][templates] - то это наша библиотека
    // возвращать объект

    return Promise.resolve([
        {
            file: 'jsonnetpkg/templates-jsonnet-apps/webapp.libsonnet',
            name: 'WebApp',
            localName: 'WebApp',
            schema: {
                title: 'Web application',
                description: 'Deployment + Service + optional Ingress',
                type: 'object',
                properties: {
                    image: { type: 'string', title: 'Container image', description: 'Location of the image', },
                    port: { type: 'number', title: 'Container port', description: 'The port that your code inside the container listens to', },
                    cmd: { type: 'string', title: 'Container command', description: 'The command to run in container or the first argument passed the the entrypoint script', },
                    args: { type: 'string', title: 'Container command arguments', description: 'Argumements to pass to the command or second and further arguments passed the the entrypoint script', },
                    servicePort: { type: 'number', title: 'Service port', description: 'Remap container port to another port in order other containers access it', },
                    ingress: { type: 'string', title: 'Ingress URL', description: 'Allow access to the service from outside the cluster by the given URL', },
                    env: { type: 'object', title: 'ENV variables', description: 'String literals to inject as ENV variables', },
                    replicas: { type: 'number', title: 'Pod replicas', description: 'Run multiple parallel instances (replicas) of the container', },
                },
                required: [
                    'image',
                    'port',
                ],
            },
        },
        {
            file: 'jsonnetpkg/templates-jsonnet-apps/worker.libsonnet',
            name: 'Worker',
            localName: 'Worker',
            schema: {
                title: 'Worker process',
                description: 'Deployment w/o serice',
                type: 'object',
                properties: {
                    image: { type: 'string', title: 'Container image', description: 'Location of the image', },
                    cmd: { type: 'string', title: 'Container command', description: 'The command to run in container or the first argument passed the the entrypoint script', },
                    args: { type: 'string', title: 'Container command arguments', description: 'Argumements to pass to the command or second and further arguments passed the the entrypoint script', },
                    env: { type: 'object', title: 'ENV variables', description: 'String literals to inject as ENV variables', },
                    replicas: { type: 'number', title: 'Pod replicas', description: 'Run multiple parallel instances (replicas) of the container', },
                },
                required: [
                    'image',
                ],
            },
        },
        {
            file: 'jsonnetpkg/templates-jsonnet-services/postgres.libsonnet',
            name: 'PostgresContainer',
            localName: 'PostgresContainer',
            schema: {
                title: 'Postgres container',
                description: 'Postgres StatefulSet + PVC',
                type: 'object',
                properties: {
                    dbName: { type: 'string', title: 'Database name', },
                    dbUser: { type: 'string', title: 'Database user', },
                    dbPassword: { type: 'string', title: 'Database password', },
                },
                required: [
                    'dbName',
                    'dbUser',
                    'dbPassword',
                ],
            },
        },
        {
            file: 'jsonnetpkg/templates-jsonnet-services/postgres.libsonnet',
            name: 'StatelessPostgresContainer',
            localName: 'StatelessPostgresContainer',
            schema: {
                title: 'Stateless Postgres container',
                description: 'Postgres Pod w/o volume',
                type: 'object',
                properties: {
                    dbName: { type: 'string', title: 'Database name', },
                    dbUser: { type: 'string', title: 'Database user', },
                    dbPassword: { type: 'string', title: 'Database password', },
                },
                required: [
                    'dbName',
                    'dbUser',
                    'dbPassword',
                ],
            },
        },
    ])
}
