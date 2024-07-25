// imports here for express and pg
const express = require("express");
const router = express.Router();
const pg = require('pg');

const client = new pg.Client('postgres://localhost/HRDirectory');
client.connect()

router.use(express.json())


//get all employees
router.get('/', async(req, res, next)=>{
    
    try{
        const response = await client.query(`SELECT * FROM "Employee" ORDER BY id ASC`);
        res.send(response.rows)
    }catch(err){
        next(err)
    }

})

// get employee by id
router.get('/:id', async(req, res, next)=>{
    try{
        const response = await client.query(`SELECT * FROM "Employee" WHERE id = $1`, [req.params.id]);
        res.send(response.rows[0])
    }catch(err){
        next(err)
    }
})

// add new employee
router.post('/', async(req, res, next)=>{
    try{
        const response = await client.query(`INSERT INTO "Employee"(name, department_id) VALUES($1, $2)`,
            [req.body.name, req.body.department_id]);
        res.send({
            name: req.body.name,
            department_id: req.body.department_id
        })
        console.log("req HERE", req.body)
    }catch(err){
        next(err)
    }
})

// delete employee
router.delete("/:id", async(req,res,next)=>{
    try{
        const response = await client.query(`DELETE from "Employee" WHERE id = $1`, [Number(req.params.id)])
        res.send({
            id:req.params.id
        }).sendStatus(204)
    }catch(err){
        next(err)
    }

})

//  update employee
router.put("/:id", async(req,res,next)=>{
    try{
       const response = await client.query(`UPDATE "Employee" SET name=$1, updated_at=now(), department_id=$3, WHERE id=$4 RETURNING *`,
           [req.body.name, req.body.updated_at, req.body.department_id, Number(req.params.id) ]);
       res.send(response.rows[0])
    }catch(err){
        next(err)
    }
})

module.exports = router;