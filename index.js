const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const session = require("express-session");

const pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123456",
    database: "owhat",
    connectionLimit: 10,
    multipleStatements: true
})


const app = express();

app.use(session({
    secret: "hello world",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30
    }
}));

app.use(express.static("www"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/login", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;


    pool.getConnection((error, connection) => {
        console.log(error);
        connection.query("select * from user where userid=?", [username], (error, result, fields) => {
            console.log(error);
            console.log(result)
            if (result == '') {
                res.send({
                    result: 0,
                    message: "用户名错误"
                })
            } else {
                if (result[0].password === password) {
                    req.session.username = username;
                    console.log(req.session);

                    console.log(req.sessionID);

                    res.send({
                        result: 1,
                        message: "登录成功"
                    })
                    return;
                }
                res.send({
                    result: 0,
                    message: "密码错误，登录失败"
                })
            }
        });
        connection.release();
    })

})


app.get("/weblogin", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;


    pool.getConnection((error, connection) => {
        console.log(error);
        connection.query("select * from webuser where webid=?", [username], (error, result, fields) => {
            console.log(error);
            console.log(result)
            if (result == '') {
                res.send({
                    result: 0,
                    message: "用户名错误"
                })
            } else {
                if (result[0].webpass === password) {
                    req.session.username = username;
                    console.log(req.session);

                    console.log(req.sessionID);

                    res.send({
                        result: 1,
                        message: "登录成功"
                    })
                    return;
                }
                res.send({
                    result: 0,
                    message: "密码错误，登录失败"
                })
            }
        });
        connection.release();
    })

})


app.get("/isLogin", (req, res) => {
    // console.log(req.session.username)
    if (req.session.username) {
        res.send({
            isLogin: true,
            username: req.session.username
        })
        return;
    }

    res.send({
        isLogin: false
    })
})

app.get("/exit", (req, res) => {
    delete req.session.username;
    console.log(req.session);
    res.send({
        result: 1,
        message: "退出登录成功"
    })
})

app.get('/register', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    pool.getConnection((error, connection) => {
        connection.query('insert into user (userid,password) values (?,?)', [username,password], (error, result, fields) => {
            console.log(error)
            console.log(result)
            res.send({
                result:1,
                message:'操作成功'
            })
        })
        connection.release()
    })


})

app.get('/updatename',(req,res)=>{
    //从请求中获取数据
    const name=req.query.name
    const userid = req.query.userid
    // const title = req.body.title
    // const des = req.body.des
    // const content = req.body.content

    pool.getConnection((error, connection) => {
        // 进行数据库的操作
        connection.query('update user set name=? where userid=?', [name,userid], (error, result, fields) => {
            console.log(error)
            res.send({
                result:1,
                message:'更新成功'
            })
        })
        //释放连接
        connection.release()
    })
})

app.get('/users', (req, res) => {
    // const username = req.query.username;
    //从连接池中获取一个连接
    pool.getConnection((error, connection) => {
        console.log(error)
        //通过该连接 执行数据库的查询操作
        connection.query('select * from user', (error, result, fields) => {
            console.log(error)
            // console.log(result)
            //查询数据库后 将查到的数据 发给前端
            res.send({
                result: 1,
                message: '获取数据成功',
                titles: result
            })
        })
        connection.release()
    })
})


app.get('/allusers', (req, res) => {
    const username = req.query.username;
    //从连接池中获取一个连接
    pool.getConnection((error, connection) => {
        console.log(error)
        //通过该连接 执行数据库的查询操作
        connection.query('select * from user where userid=?', [username], (error, result, fields) => {
            console.log(error)
            // console.log(result)
            //查询数据库后 将查到的数据 发给前端
            res.send({
                result: 1,
                message: '获取数据成功',
                titles: result
            })
        })
        connection.release()
    })
})

app.get('/allmodules', (req, res) => {
    // const username = req.query.username;
    //从连接池中获取一个连接
    pool.getConnection((error, connection) => {
        console.log(error)
        //通过该连接 执行数据库的查询操作
        connection.query('select * from homemodule', (error, result, fields) => {
            console.log(error)
            // console.log(result)
            //查询数据库后 将查到的数据 发给前端
            res.send({
                result: 1,
                message: '获取数据成功',
                titles: result
            })
        })
        connection.release()
    })
})

app.get('/allshop', (req, res) => {
    // const username = req.query.username;
    //从连接池中获取一个连接
    pool.getConnection((error, connection) => {
        console.log(error)
        //通过该连接 执行数据库的查询操作
        connection.query('select * from shop', (error, result, fields) => {
            console.log(error)
            // console.log(result)
            //查询数据库后 将查到的数据 发给前端
            res.send({
                result: 1,
                message: '获取数据成功',
                titles: result
            })
        })
        connection.release()
    })
})


app.get('/module', (req, res) => {
    const id = req.query.id;
    //从连接池中获取一个连接
    pool.getConnection((error, connection) => {
        console.log(error)
        //通过该连接 执行数据库的查询操作
        connection.query('select * from homemodule where id=?',[id], (error, result, fields) => {
            console.log(error)
            // console.log(result)
            //查询数据库后 将查到的数据 发给前端
            res.send({
                result: 1,
                message: '获取数据成功',
                titles: result
            })
        })
        connection.release()
    })
})

app.get('/starshop', (req, res) => {
    const id = req.query.id;
    //从连接池中获取一个连接
    pool.getConnection((error, connection) => {
        console.log(error)
        //通过该连接 执行数据库的查询操作
        connection.query('select * from shop where name=?',[id], (error, result, fields) => {
            console.log(error)
            // console.log(result)
            //查询数据库后 将查到的数据 发给前端
            res.send({
                result: 1,
                message: '获取数据成功',
                titles: result
            })
        })
        connection.release()
    })
})

app.get('/shoplist', (req, res) => {
    const id = req.query.id;
    //从连接池中获取一个连接
    pool.getConnection((error, connection) => {
        console.log(error)
        //通过该连接 执行数据库的查询操作
        connection.query('select * from shop where star=?',[id], (error, result, fields) => {
            console.log(error)
            // console.log(result)
            //查询数据库后 将查到的数据 发给前端
            res.send({
                result: 1,
                message: '获取数据成功',
                titles: result
            })
        })
        connection.release()
    })
})

app.get('/week', (req, res) => {
    // const id = req.query.id;
    //从连接池中获取一个连接
    pool.getConnection((error, connection) => {
        console.log(error)
        //通过该连接 执行数据库的查询操作
        connection.query('select * from week', (error, result, fields) => {
            console.log(error)
            // console.log(result)
            //查询数据库后 将查到的数据 发给前端
            res.send({
                result: 1,
                message: '获取数据成功',
                titles: result
            })
        })
        connection.release()
    })
})

app.get('/cardcomment', (req, res) => {
    const title = req.query.title;
    //从连接池中获取一个连接
    pool.getConnection((error, connection) => {
        console.log(error)
        //通过该连接 执行数据库的查询操作
        connection.query('select * from comment where title=? order by id desc',[title] ,(error, result, fields) => {
            console.log(error)
            // console.log(result)
            //查询数据库后 将查到的数据 发给前端
            res.send({
                result: 1,
                message: '获取数据成功',
                titles: result
            })
        })
        connection.release()
    })
})

app.get('/starcomment', (req, res) => {
    const name = req.query.name;
    //从连接池中获取一个连接
    pool.getConnection((error, connection) => {
        console.log(error)
        //通过该连接 执行数据库的查询操作
        connection.query('select * from comment where title=? order by id desc',[name] ,(error, result, fields) => {
            console.log(error)
            // console.log(result)
            //查询数据库后 将查到的数据 发给前端
            res.send({
                result: 1,
                message: '获取数据成功',
                titles: result
            })
        })
        connection.release()
    })
})

    app.get('/addcomment', (req, res) => {
        const name = req.query.name
        // console.log(name)
        const namesrc = req.query.namesrc
        // console.log(namesrc)
        const title = req.query.title
        // console.log(title)
        const content = req.query.content
        // console.log(content)
        const time=new Date()
        // console.log(time)
        pool.getConnection((error, connection) => {
            connection.query('insert into comment (name,namesrc,content,time,title) values (?,?,?,?,?)', [name,namesrc,content,time,title], (error, result, fields) => {
                console.log(error)
                console.log(result)
                res.send({
                    result:1,
                    message:'操作成功'
                })
            })
            connection.release()
        })


    })

    app.get('/allstars',(req,res)=>{
        // const id = req.query.id
        //从连接池中获取一个连接
        pool.getConnection((error,connection)=>{
            console.log(error)
            //通过该连接 执行数据库的查询操作
            connection.query('select * from star ',(error,result,fields)=>{
                console.log(error)
                console.log(result)
                //查询数据库后 将查到的数据 发给前端
                res.send({
                    result:1,
                    message:'获取数据成功',
                    titles:result
                })
            })
            connection.release()
        })
    })

    app.get('/addlove', (req, res) => {
        const name = req.query.name
        const userid = req.query.userid
        pool.getConnection((error, connection) => {
            connection.query('insert into lovestar (name,userid) values (?,?)', [name,userid], (error, result, fields) => {
                console.log(error)
                console.log(result)
                res.send({
                    result:1,
                    message:'操作成功'
                })
            })
            connection.release()
        })
    })

    
    app.get('/deletelove',(req,res)=>{
        const userid = req.query.userid
        const name = req.query.name
        pool.getConnection((error,connection)=>{
            connection.query('delete from lovestar where userid=? and name=?',[userid,name],(error,result,fields)=>{
                console.log(error)
                console.log(result)
                res.send({
                    result:0,
                    message:'删除成功了'
                })
            })
            connection.release()
        })
    })


    app.get('/lovestar',(req,res)=>{
        const userid = req.query.userid
        //从连接池中获取一个连接
        pool.getConnection((error,connection)=>{
            console.log(error)
            //通过该连接 执行数据库的查询操作
            connection.query("select * from lovestar where userid=?",[userid],(error,result,fields)=>{
                console.log(error)
                console.log(result)
                //查询数据库后 将查到的数据 发给前端
                res.send({
                    result:1,
                    message:'获取数据成功',
                    titles:result
                })
            })
            connection.release()
        })
    })

    app.get('/islove',(req,res)=>{
        const name = req.query.name
        //从连接池中获取一个连接
        pool.getConnection((error,connection)=>{
            console.log(error)
            //通过该连接 执行数据库的查询操作
            connection.query("select * from lovestar where name=?",[name],(error,result,fields)=>{
                console.log(error)
                console.log(result)
                //查询数据库后 将查到的数据 发给前端
                res.send({
                    result:1,
                    message:'获取数据成功',
                    titles:result
                })
            })
            connection.release()
        })
    })


    app.get('/unlove',(req,res)=>{
        const name = req.query.name
        //从连接池中获取一个连接
        pool.getConnection((error,connection)=>{
            console.log(error)
            //通过该连接 执行数据库的查询操作
            connection.query("select * from star where  name not like ? ",[name],(error,result,fields)=>{
                console.log(error)
                console.log(result)
                //查询数据库后 将查到的数据 发给前端
                res.send({
                    result:1,
                    message:'获取数据成功',
                    titles:result
                })
            })
            connection.release()
        })
    })


    app.get('/star',(req,res)=>{
        const name = req.query.name
        //从连接池中获取一个连接
        pool.getConnection((error,connection)=>{
            console.log(error)
            //通过该连接 执行数据库的查询操作
            connection.query('select * from star where name=?',[name],(error,result,fields)=>{
                console.log(error)
                console.log(result)
                //查询数据库后 将查到的数据 发给前端
                res.send({
                    result:1,
                    message:'获取数据成功',
                    titles:result
                })
            })
            connection.release()
        })
    })


    app.get('/buy',(req,res)=>{
        const username = req.query.username
        //从连接池中获取一个连接
        pool.getConnection((error,connection)=>{
            console.log(error)
            //通过该连接 执行数据库的查询操作
            connection.query('select * from shopcart where username=?',[username],(error,result,fields)=>{
                console.log(error)
                console.log(result)
                //查询数据库后 将查到的数据 发给前端
                res.send({
                    result:1,
                    message:'获取数据成功',
                    titles:result
                })
            })
            connection.release()
        })
    })

    app.get('/addbuy', (req, res) => {
        // console.log(req.query)
        const name = req.query.name
        const shopuser=req.query.shopuser
        const shopimg=req.query.shopimg
        const price =req.query.price
        const userimg=req.query.userimg
        const username = req.query.username
        pool.getConnection((error, connection) => {
            connection.query('insert into shopcart (name,shopuser,shopimg,price,userimg,username) values (?,?,?,?,?,?)', [name,shopuser,shopimg,price,userimg,username], (error, result, fields) => {
                console.log(error)
                console.log(result)
                res.send({
                    result:1,
                    message:'操作成功'
                })
            })
            connection.release()
        })
    })


    app.get('/delbuy', (req, res) => {
        // console.log(req.query)
        const id = req.query.id
        pool.getConnection((error, connection) => {
            connection.query('delete from shopcart where id=?', [id], (error, result, fields) => {
                console.log(error)
                console.log(result)
                res.send({
                    result:1,
                    message:'操作成功'
                })
            })
            connection.release()
        })
    })

    app.get('/numbuy', (req, res) => {
        // console.log(req.query)
        const id = req.query.id
        pool.getConnection((error, connection) => {
            connection.query('select * from shopcart where id=?', [id], (error, result, fields) => {
                console.log(error)
                console.log(result)
                res.send({
                    result:1,
                    message:'获取数据成功',
                    titles:result
                })
            })
            connection.release()
        })
    })

app.listen(3000, () => {
    console.log("3000.....");
})