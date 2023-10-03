import express from "express";
import mongoose from "mongoose";

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {  

    await mongoose.connect("mongodb://localhost:27017/tasklistDB");

    const taskSchema = new mongoose.Schema({
        task: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: new Date().toLocaleString("pt-BR"),
        },
        check: {
            type: Boolean,
            default: false,
            required: true
        },
    });

    const Task = mongoose.model("Task", taskSchema);

    app.get("/", async (req, res) => {

        const taskItems = await Task.find({check: false});
        const checkItems = await Task.find({check: true})
        if (taskItems.length < 1 && checkItems.length < 1) {
            const task1 = new Task({
                task: "Do the bed.",
            });
            const task2 = new Task({
                task: "Brush teeth.",
            });
            const task3 = new Task({
                task: "Prepare breakfast.",
            });
            const tasksIn = await Task.insertMany([task1, task2, task3]);
            console.log(tasksIn);
        }
        const taskArray = taskItems.map(item => item.task);
        const checkArray = checkItems.map(task => task.task);
        res.render("index.ejs", {
            toDos: taskArray,
            checkedTask: checkArray,
        });

    });

    app.post("/", async (req, res) => {

        const newToDo = req.body.todo.trim();
        const taskItems = await Task.find({check: false});
        const checkItems = await Task.find({check: true});
        const checkDuplicity = taskItems.filter(obj => obj.task === newToDo);
        // console.log(checkDuplicity);
        let errorMsg
        if (!newToDo) {
            errorMsg = "Insert a valid To-Do.";
            runErrorRender()
        } else if (newToDo.length < 3) {
            errorMsg = "To-Do must have at least 3 characters";
            runErrorRender()
        } else if (checkDuplicity.length > 0) {
            errorMsg = "Already exists.";
            runErrorRender()
        } else {
            const newTask = await new Task({
                task: newToDo,
            }).save()
                console.log(newTask);
                res.redirect("/");
        };
        async function runErrorRender() {
            const taskArray = taskItems.map(item => item.task);
            const checkArray = checkItems.map(item => item.task);
            // console.log(checkItems)
            res.render("index.ejs", {
                errorMsg: errorMsg,
                toDos: taskArray,
                checkedTask: checkArray,
            });
        };

    });

    app.get("/delete?:index", async (req, res) => {

        // console.log(req.query.index);
        const indexValue = Number(req.query.index);
        const findAll = await Task.find({check: false});
        const taskToDel = findAll[indexValue]._id;
        // console.log(taskToDel);
        const deleteTask = await Task.deleteOne({_id: taskToDel});
        // console.log(deleteTask);
        res.redirect("/");

    });

    app.get("/check?:index", async (req, res) => {

        const indexQuery = Number(req.query.index);
        console.log(indexQuery);
        const findAll = await Task.find({check: false});
        const updateTask = await Task.updateOne({_id: findAll[indexQuery]._id}, {check: true});
        console.log(updateTask);
        res.redirect("/");

    });

    app.get("/delete/checked?:index", async (req, res) => {

        const indexQuery = Number(req.query.index);
        const checkTasks = await Task.find({check: true});
        const updateTask = await Task.deleteOne({_id: checkTasks[indexQuery]._id});
        console.log(updateTask)
        res.redirect("/")
    });

};

app.listen(3000, () => {
    console.log("Server running at port 3000.");
})









//  ----- CÓDIGO REMOVIDO -----

 // const task1 = new Task({
    //     task: "Do the bed.",
    //     date: new Date().toLocaleString("pt-BR"),
    // });
    // const task2 = new Task({
    //     task: "Brush teeth.",
    //     date: new Date().toLocaleString("pt-BR"),
    // });
    // const task3 = new Task({
    //     task: "Prepare breakfast.",
    //     date: new Date().toLocaleString("pt-BR"),
    // });
    // const tasksIn = await Task.insertMany([task1, task2, task3])
    // console.log(tasksIn)

    // mongoose.connection.close()   

// const toDos = ["Wash the dishes.", "Do the bed.", "Pay bills."]

// app.get("/newtodo", (req, res) => {
//     res.redirect("/");
// })
// app.post("/newtodo", (req, res) => {
//     const newToDo = req.body.todo.trim();
//     console.log(newToDo);

//     let errorMsg
//     if (toDos.includes(newToDo)) {
//         errorMsg = "Already exists.";    
//     } else if (!newToDo) {
//         errorMsg = "Insert a valid To-Do.";
//     } else if (newToDo.length < 3) {
//         errorMsg = "To-Do must have at least 3 characters";
//     } else {
//         toDos.push(newToDo);
//         return res.redirect("/");
//     }
//     res.render("index.ejs", {
//         errorMsg: errorMsg,
//         toDos: toDos,
//         checkedTask: checkedTask
//     });
// });

// app.get("/delete?:index", (req, res) => {
//     console.log(req.query.index);
//     const indexQuery = Number(req.query.index);
//     toDos.splice(indexQuery, 1)
//     res.redirect("/")
// })
// app.get("/check?:index", (req, res) => {
//     console.log(req.query.index);
//     const indexQuery = Number(req.query.index);
//     const rmTask = toDos.splice(indexQuery, 1);
//     checkedTask.unshift(rmTask)
//     res.redirect("/")
// })
