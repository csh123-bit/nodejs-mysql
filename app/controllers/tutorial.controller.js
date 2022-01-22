const { send } = require("express/lib/response");
const Tutorial = require("../models/tutorial.model");

exports.create = (req,res)=>{

    //validate request
    if(!req.body){
        res.status(400).send({
            message:"content can not be empty!"
        });
    }

    //create a tutorial
    const tutorial = new Tutorial({
        title:req.body.title,
        description:req.body.description,
        published:req.body.published||false
    });

    Tutorial.create(tutorial, (err, data)=>{
        if(err)
            res.status(500).send({
                message:
                    err.message||"Some error occured while creating the Tutorial."
            });
        else res.send(data);
    });
};

exports.findAll = (req,res)=>{
    const title = req.query.title;

    Tutorial.getAll(title, (err, data)=>{
        if(err){
            res.status(500).send({
                message:
                    err.message||"some error occured while retrieving tutorials"
            });
        }
        else{
            res.send(data);
        }
    });
};

exports.findOne = (req, res)=>{
    Tutorial.findById(req.params.id, (err, data)=>{
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({
                    message: "not found tutorial with id "+req.params.id
                });
            }else{
                res.status(500).send({
                    message: "error retrieving tutorial with id "+req.params.id
                });
            }
        }else res.send(data);
    });
};

exports.findAllPublished = (req, res)=>{
    Tutorial.getAllPublished((err, data)=>{
        if(err)
            res.status(500).send({
                message:
                    err.message|"some error occured while retrieving tutorials"
            });
        else res.send(data);
    });
};

exports.update = (req, res)=>{
    if(!req.body){
        res.status(400).send({
            message:"content can not be empty!"
        });
    }

    console.log(req.body);

    Tutorial.updateById(
        req.params.id,
        new Tutorial(req.body),
        (err, data)=>{
            if(err){
                if(err.kind==="not_found"){
                    res.status(404).send({
                        message:"not found tutorial with id "+req.params.id
                    });
                }else{
                    res.status(500).send({
                        message:"error updating tutorial with id "+req.params.id
                    });
                }
            }else res.send(data);
        }
    );
};

exports.delete = (req, res)=>{
    Tutorial.remove(req.params.id, (err,data)=>{
        if(err){
            if(err.kind==="not_found"){
                res.status(404).send({
                    message:"could not delete tutorial with id "+req.params.id
                });
            }else{
                res.status(500).send({
                    message:"could not delete tutorial with id "+req.params.id               
                });
            }
        }else res.send({message:'deleted ok'});
    });
};

exports.deleteAll = (req,res)=>{
    Tutorial.removeAll((err, data)=>{
        if(err)
            res.status(500).send({
                message:
                    err.message||"some error occurred while removing all tutorials"
            });
        else res.send({message:"all tutorials were deleted successfully"});    
    });
};