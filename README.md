# Cafeteria Lulu - Aplicación E-commerce con AngularJS

## Descripción del Proyecto

Esta es una aplicación de comercio electrónico desarrollada con **AngularJS** como parte del programa de Maestría en Ciencias de la Computación de la **Broward International University (BIU)**. El proyecto demuestra el uso de frameworks web modernos para crear una aplicación completamente funcional.

## Objetivo Académico

El objetivo principal de este proyecto es demostrar, mediante una muestra de comercio electrónico para el negocio ficticio "Cafeteria Lulu", el uso efectivo de frameworks web para crear una aplicación completamente funcional. Esta aplicación sirve como ejemplo práctico de cómo las tecnologías web modernas pueden ser utilizadas para desarrollar soluciones de comercio electrónico robustas y escalables.

## Características de la Aplicación

### 🏪 Negocio Simulado: Cafeteria Lulu
- **Cafeteria Lulu** es un negocio ficticio especializado en café premium y pasteles recién horneados
- La aplicación simula una experiencia de compra completa para una cafetería

### 🛍️ Funcionalidades Implementadas

#### Navegación y Estructura
- **Sistema de enrutamiento** con AngularJS Route
- **Navegación intuitiva** entre diferentes secciones
- **Diseño responsivo** utilizando Tailwind CSS

#### Catálogo de Productos
- **Visualización de productos** con imágenes, nombres y precios
- **Productos disponibles:**
  - Espresso ($3.99)
  - Cappuccino ($4.49)
  - Croissant ($2.99)
  - Muffin ($3.49)

#### Carrito de Compras
- **Agregar productos** al carrito de compras
- **Eliminar productos** del carrito
- **Cálculo automático** del total de la compra
- **Contador visual** de productos en el carrito

#### Interfaz de Usuario
- **Diseño moderno** con gradientes y sombras
- **Paleta de colores** temática (ámbar y marrón)
- **Experiencia de usuario** fluida y atractiva

## Tecnologías Utilizadas

### Frontend
- **AngularJS 1.8.2** - Framework principal de JavaScript
- **AngularJS Route** - Sistema de enrutamiento
- **Tailwind CSS 2.2.19** - Framework de CSS para estilos
- **HTML5** - Estructura semántica
- **JavaScript ES6+** - Lógica de la aplicación

### Arquitectura
- **Arquitectura MVC** (Model-View-Controller)
- **Inyección de dependencias** de AngularJS
- **Controladores** para manejo de lógica de negocio
- **Vistas modulares** con templates separados

## Estructura del Proyecto

```
e-commerce-app-cafeteria-lulu/
├── app.js              # Configuración principal de AngularJS y lógica de la aplicación
├── index.html          # Página principal con navegación
├── home.html           # Página de inicio de la cafetería
├── products.html       # Catálogo de productos y carrito de compras
├── styles.css          # Estilos personalizados adicionales
└── README.md           # Este archivo de documentación
```

## Funcionalidades Técnicas Demostradas

### 1. Configuración de Módulos AngularJS
- Definición del módulo principal `eCommerceApp`
- Configuración del proveedor de rutas `$routeProvider`
- Mapeo de rutas a templates específicos

### 2. Controladores y Scope
- Implementación del `ShopController`
- Gestión del estado de la aplicación con `$scope`
- Manejo de datos de productos y carrito de compras

### 3. Enrutamiento
- Configuración de rutas para diferentes vistas
- Redirección automática a la página de inicio
- Navegación SPA (Single Page Application)

### 4. Gestión de Datos
- Almacenamiento de productos en memoria
- Operaciones CRUD básicas para el carrito
- Cálculos dinámicos de totales

### 5. Interfaz de Usuario Reactiva
- Binding bidireccional de datos
- Actualización automática de la interfaz
- Eventos de usuario (clicks, navegación)

## Cómo Ejecutar la Aplicación

1. **Clonar o descargar** el proyecto
2. **Abrir** el archivo `index.html` en un navegador web moderno
3. **Navegar** por las diferentes secciones usando el menú superior
4. **Explorar** los productos y funcionalidades del carrito

## Consideraciones para Desarrollo Futuro

### Integración con Backend
- El código incluye comentarios para futuras integraciones con APIs REST
- Endpoints preparados para:
  - `GET /api/products` - Obtener productos
  - `POST /api/cart` - Agregar al carrito
  - `DELETE /api/cart/:id` - Eliminar del carrito

### Mejoras Potenciales
- Implementación de autenticación de usuarios
- Integración con sistemas de pago
- Gestión de inventario
- Panel de administración
- Optimización para dispositivos móviles

## Propósito Educativo

Este proyecto demuestra conceptos fundamentales de desarrollo web moderno:

- **Frameworks JavaScript** y su utilidad en desarrollo web
- **Arquitectura de aplicaciones** de una sola página (SPA)
- **Separación de responsabilidades** entre lógica y presentación
- **Gestión de estado** en aplicaciones del lado del cliente
- **Integración de tecnologías** frontend modernas

## Conclusión

La aplicación "Cafeteria Lulu" representa un ejemplo práctico y funcional de cómo los frameworks web modernos, específicamente AngularJS, pueden ser utilizados para crear aplicaciones de comercio electrónico completas. Este proyecto cumple con el objetivo académico de demostrar el uso efectivo de tecnologías web en el desarrollo de soluciones empresariales reales.

---

**Desarrollado para:** Broward International University (BIU)  
**Programa:** Maestría en Ciencias de la Computación  
**Tecnología:** AngularJS  
**Negocio:** Cafeteria Lulu (ficticio)
