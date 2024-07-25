const express = require("express");
const router = express.Router();
const pg = require("pg");

const client = new pg.Client("postgres://localhost/HRDirectory");
client.connect();

// get all departments
router.get("/", async (req, res, next) => {
  try {
    const response = await client.query(
      `SELECT * FROM "Department" ORDER BY id ASC`
    );
    res.send(response.rows);
  } catch (err) {
    next(err);
  }
});


//get department by id
router.get('/:id', async(req, res, next)=>{
    try{
        const response = await client.query(`SELECT * FROM "Department" WHERE id = $1`, [req.params.id]);
        res.send(response.rows)
    }catch(err){
        next(err)
    }
})


module.exports = router;