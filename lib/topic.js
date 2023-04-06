const url = require('url');
const qs = require('querystring');
const db = require(`../db/db`);
const template = require('../lib/template');
const sanitize = require('sanitize-html');
module.exports={
    page: function(request,response){
    const queryData = url.parse(request.url,true).query;
        db.query(`SELECT * FROM topic`,(error,topics)=>{
            db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id =?`,[queryData.id],(error2, topic)=>{
                const title = topic[0].title;
                const list = template.link(topics);         
                const html = template.html(title,list,topic[0].description + `
                <p>by ${topic[0].name}</p>
                `,
                    `<a href="/create">create</a>
                    <a href="/update?id=${queryData.id}">update</a>
                    <form action="/delete_process" method="post">
                        <input type="hidden" name="id" value="${queryData.id}">
                        <p><input type="submit" value="delete"></p>
                    </form>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    },

    home: function(request,response){
        db.query(`SELECT * FROM topic`,(error,topics)=>{
            const title = 'WELCOME';
            const data = 'NODE. JS';
            const list = template.link(topics);         
            const html = template.html(title,list,data,
                `<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(html);
        });
    },

    create: function(request,response){

        db.query(`SELECT * FROM topic`,(error,topics)=>{
            db.query(`SELECT * FROM author`,(error2, authors)=>{
                const select_form = template.authorLink(authors);
                const title = 'CREATE';
                const data = `<form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                ${select_form}
                <p><input type="submit" value="create"></p>
                </form>`;
                const list = template.link(topics);         
                const html = template.html(title,list,data,``);
                response.writeHead(200);
                response.end(html);
            });
        });
    },

    create_process: function(request,response){
        let body = ``;
        request.on('data',data=>{
            body += data;
        });
        request.on('end',()=>{
            const post = qs.parse(body);
            // console.log(post);
            db.query(`INSERT INTO topic(title,description,created,author_id)
            VALUES(?,?,now(),?)`,[post.title, post.description, post.author_id],(error,result)=>{
                // console.log("result",result);
                response.writeHead(302,{location:`/?id=${result.insertId}`});
                response.end();
            });         
        });
    },

    update: function(request, response){
        const queryData = url.parse(request.url,true).query;
        db.query(`SELECT * FROM topic`,(error,topics)=>{
            db.query(`SELECT * FROM topic WHERE id =?`,[queryData.id],(error2, topic)=>{
                // console.log(topic[0]);
                db.query(`SELECT * FROM author`,(error3, authors)=>{
                    const select_form = template.authorLink(authors,topic[0].author_id);
                    const title = 'UPDATE';
                    const list = template.link(topics);         
                    const html = template.html(title,list,``,
                        `<form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${queryData.id}">
                        <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                        <p><textarea name="description" placeholder="description">${topic[0].description}</textarea></p>
                        ${select_form}
                        <p><input type="submit" value="update"></p>
                    </form>`
                    );
                    response.writeHead(200);
                    response.end(html);
                });
            });
        });
    },

    update_process: function(request, response){
        let body = ``;
        request.on('data',data=>{
            body += data;
        });
        request.on('end',()=>{
            const post = qs.parse(body);
            // console.log(post);
            db.query(`UPDATE topic SET
            title=?, description=?, author_id=? WHERE id=?`,
            [post.title, post.description, post.author_id, post.id],(error,result)=>{
                response.writeHead(302,{location:`/?id=${post.id}`});
                response.end();
            });
        });
    },

    delete_process: function(request, response){
        let body = ``;
        request.on('data',data=>{
            body += data;
        });
        request.on('end',()=>{
            const post = qs.parse(body);
            console.log(post);
            db.query(`delete FROM topic WHERE id =?`,[post.id],(error,result)=>{
                response.writeHead(302,{location:`/`});
                response.end();
            });
        });
    }


    
    
    
}