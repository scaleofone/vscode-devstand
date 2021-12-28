import vscode from 'vscode'

export default async function(): Promise<{file:string, template:string, schema:{ title:string, description:string }}[]> {

    // TODO actually find libsonnet files
    // найти все libsonnet файлы, исключить директорию k8s-libsonnet, исключить symlink-и (брать только symlink-и ???)
    // прочитать файл, взять только те, внутри которых есть строка "libraryMeta"
    // сделать файлу eval
    // если вернется [libraryMeta][templates] - то это наша библиотека
    // возвращать объект

    return Promise.resolve([
        {
            file: 'jsonnetpkg/templates-jsonnet-apps/webapp.libsonnet',
            template: 'WebApp',
            schema: {
                title: 'Web application',
                description: 'Deployment + Service + optional Ingress',
            },
        },
        {
            file: 'jsonnetpkg/templates-jsonnet-apps/worker.libsonnet',
            template: 'Worker',
            schema: {
                title: 'Worker process',
                description: 'Deployment w/o serice',
            },
        },
        {
            file: 'jsonnetpkg/templates-jsonnet-services/postgres.libsonnet',
            template: 'PostgresContainer',
            schema: {
                title: 'Postgres container',
                description: 'Postgres StatefulSet + PVC',
            },
        },
        {
            file: 'jsonnetpkg/templates-jsonnet-services/postgres.libsonnet',
            template: 'StatelessPostgresContainer',
            schema: {
                title: 'Stateless Postgres container',
                description: 'Postgres Pod w/o volume',
            },
        },
    ])
}
