const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send('Server is running...');
});

io.on('connection', (socket) =>{
    socket.emit('me', socket.id);

    socket.on('disconnect', ()=> {
        socket.broadcast.emit("callend");
    });

    socket.on("calluser", ({ userToCall,signalData,from,name}) => {
        io.to(userToCall).emit("calluser", {signal: signalData,from,name});
    });

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
    });

})

server.listen(PORT, () => console.log(`Server listining on port ${PORT}`));


//npm install @material-ui/core @material-ui/icons react-copy-to-clipboard simple-peer socket.io-client