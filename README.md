<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Este proyecto esta realizado en el curso de nestjs - Teslo Api

## Antes de empezar debemos de instalar algunos comandos importantes

- Este comando es necesario para poder utilizar las variables de entorno
```
yarn add @nestjs/config
```

- Este comando en necesario para poder installar TypeOrm
```
yarn add @nestjs/typeorm typeorm pg
```

- Es comando es necesario para poder trabajar con archivos
```
yarn add -D @types/multer
```


# Teslo API
1. Clonar el repositorio
2. ```yarn install``
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env``
4. Cambiar las variables de entorno
5. Levantar la base de datos 
```
docker-compose up -d
```

6. Ejecutar SEED
```
http://localhost:3000/api/seed
```

7. Levantar la base de datos ``` yarn start:dev```


