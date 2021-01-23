# Bolsa de Trabajo FIUBA: deploy

Trabajo Práctico Profesional, FIUBA, 2020

## Comandos de yarn

En este repositorio se usa `yarn` como gestor de dependencias

- `yarn install`: Este comando instala las dependencias especificadas en el
  archivo `package.json`.

- `yarn start`: Este comando ejecuta la aplicación de React para que
  se recompile en caso de que se detecte un cambio. Se usa para desarrollo.

- `yarn build`: Este comando compila los archivos de Typescript a Javascript
  creando la aplicación productiva en la carpeta `dist`.

- `yarn test`: Este comando ejecuta los tests.

- `yarn lint`: Este comando ejecuta todos los linters que están integrados,
  es decir, ejecuta `tslint` y `tsc` que es el compilador. 

- `yarn lint:test`: Este comando ejecuta el linter de `tslint` para los 
archivos del directorio de `test`.

- `yarn lint:src`: Este comando ejecuta el linter de `tslint` para los 
archivos del directorio de `src`.

- `yarn lint:scripts`: Este comando ejecuta el linter de `tslint` para los 
archivos del directorio de `scripts`.

- `yarn deploy:setup`: Este comando ejecuta el script `setup.ts`

- `yarn deploy:backend`: Este comando ejecuta el script `deploy_backend.ts`

- `yarn deploy:frontend`: Este comando ejecuta el script `deploy_frontend.ts`

- `yarn stash`: Este comando utiliza el stash de git para ocultar los archivos
  que no están agregados para el commit. Se usa al momento de querer realizar un commit cuando
  tenemos archivos nuevos sin agregar.

- `yarn unstash`: Este comando saca de la pila del stash de git los últimos
  archivos del stash.

