#!/bin/bash

# Inicializar Husky
npx husky init

# Instalar dependencias con Yarn
yarn

# Ejecutar el comando de desarrollo (suponiendo que `dev` es el script definido en tu package.json)
yarn dev
