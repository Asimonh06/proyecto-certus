const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Alumno = require('./models/Alumno')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API DE ALUMNOS',
            version: '1.0.0',
            description: 'API para gestionar los alumnos'
        },
        servers: [
            {
                url: 'http://localhost:4000'
            }
        ]
    },
    apis:['./app.js']
};

const app = express()
app.use(express.json())

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

const MONGO_URI = "mongodb+srv://asimonh06:Operation7%3A@cluster0.o91pug4.mongodb.net/modulares?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI).then(()=>{
    console.log("Base de datos conectado ✔");
}).catch((err) =>{
    console.log("Error encontrado ❌: " , err);
})

/**
 * @swagger
 * /alumnos:
 *  post:
 *      summary: Crea un nuevo alumno
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          nombre:
 *                              type: string
 *                              example: Max Daniel
 *                          apellido:
 *                              type: string
 *                              example: Torres Castillo
 *                          edad:
 *                              type: integer
 *                              example: 66
 *                          genero:
 *                              type: string
 *                              example: Masculino
 *                          carrera:
 *                              type: string
 *                              example: Ing Minas
 *                          comentarios:
 *                              type: string
 *                              example: Me gusta la cancion soy minero del Rubius
 *                      required:
 *                          - nombre
 *                          - apellido
 *                          - edad
 *                          - genero
 *                          - carrera
 *      responses:
 *          201:
 *              description: Alumno registrado correctamente
 *          400:
 *              description: Error al registrar alumno
 * 
 */

app.post('/alumnos', async (req, res) =>{
    try{
        const nuevoAlumno = new Alumno(req.body);
        await nuevoAlumno.save();
        res.status(200).json({message:"Alumno registrado correctamente ✔"})
    }catch(err){
        console.log(err);
        res.status(400).json({message:"Error al registrar alumno ❌"})
    }
})

/**
 * @swagger
 * /alumnos:
 *  get:
 *      summary:  Obtiene todos los alumnos
 *      responses:
 *          200:
 *              description: Lista de alumnos
 *          400:
 *              description: Error al listar alumnos
 *      
 * 
 */

app.get('/alumnos', async (req, res) =>{
    try{
        const alumnos = await Alumno.find();
        res.status(200).json(alumnos)
    }catch(err){
        console.log(err);
        res.status(400).json({message:"Error al listar alumnos ❌"})
    }
})

app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
});

app.listen(4000, ()=>{
    console.log("Ejecutando en el puerto 4000");
})