const template = require('../lib/template');
const db = require(`../db/db`);
const qs = require('querystring');
const aurl = require('url');
const sanitize = require('sanitize-html');
module.exports = {
    home : function(request,response,url){
        const queryData = aurl.parse(url,true).query;
        db.query(`SELECT * FROM topic`,(error,topics)=>{
            db.query(`SELECT * FROM author`, (error2, authors)=>{
                db.query(`SELECT * FROM author WHERE id =?`,[queryData.id],(error3,author)=>{
                    const title = 'author List';
                    const data = template.authorHome(authors);
                    const list = template.link(topics);
                    let html = '';
                    if(queryData.id === undefined){         
                        html = template.html(sanitize(title),list,sanitize(data),`
                        <form action="/create_process_author" method="post">
                            <p><input type="text" name="name" placeholder="name"></p>
                            <p><textarea name="profile" placeholder="profile"></textarea></p>
                            <p><input type="submit" value="create author"></p>
                        </form>
                        `,url);
                    } else {
                        html = template.html(title,list,data,`
                        <form action="/create_process_author" method="post">
                            <p><input type="text" name="name" placeholder="name" value="${sanitize(author[0].name)}"></p>
                            <p><textarea name="profile" placeholder="profile">${sanitize(author[0].profile)}</textarea></p>
                            <p><input type="submit" value="update author"></p>
                        </form>
                        `,url);
                    }
                    // console.log("url",url);
                    response.writeHead(200);
                    response.end(html);
                });
            });
        });
    },

    create_process_author: function(request, response){
        let body = ``;
        request.on('data',data=>{
            body += data;
        });
        request.on('end',()=>{
            const post = qs.parse(body);
            // console.log(post);
            db.query(`INSERT INTO author(name, profile)
            VALUES(?,?)`,[post.name, post.profile],(error,result)=>{
                console.log("result",result);
                response.writeHead(302,{location:`/author`});
                response.end();
            });         
        });
    },

    update_process_author: function(request,response){
        let body = ``;
        request.on('data',data=>{
            body += data;
        });
        request.on('end',()=>{
            const post = qs.parse(body);
            // console.log(post);
            db.query(`UPDATE author SET
            name=?, profile=? WHERE id=?`,
            [post.name, post.profile, post.id],(error,result)=>{
                response.writeHead(302,{location:`/author`});
                response.end();
            });
        });
    },

    delete_process_author: function(request,response){
        let body = ``;
        request.on('data',data=>{
            body += data;
        });
        request.on('end',()=>{
            const post = qs.parse(body);
            // console.log(post);
            db.query(`DELETE FROM topic WHERE author_id =?`,[post.id],(error1,result1)=>{
                db.query(`delete FROM author WHERE id =?`,[post.id],(error,result)=>{
                    response.writeHead(302,{location:`/author`});
                    response.end();
                });
            });
        });
    }

}