const jwt = require('jsonwebtoken');
const Article = require('../models/article.schema');

const {successMessage, failedMessage } = require('../helpers/response');

exports.addLikes = async (req, res) => {
    try{
        let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
        let article = await Article.findById(req.params.article_id)
        let index = article.likes.indexOf(user._id)
        if (index != -1){
            article.likes.splice(index,1)
            await article.save()
            return successMessage(res, 'Like removed!', 200)
        }
        else{
            article.likes.push(user._id)
            await article.save()
            return successMessage(res, 'Liked!', 200)
        }
    }
    catch(err) {
        return failedMessage(res, err, 422)
    }

}
