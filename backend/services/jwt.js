import jwt from 'jsonwebtoken';


export const Sign = async data => {
    const token = jwt.sign(data, process.env.JWT_SECRET,{expiresIn:'24h'});
    return token;
}

export const Verify = async token => { 
    const verified = await jwt.verify(token, process.env.JWT_SECRET);
    return verified;
}