import jwt from 'jsonwebtoken';


export const Sign = async data => {
    if (!data) return null;
    const token = jwt.sign(data, process.env.JWT_SECRET,{expiresIn:'24h'});
    return token;
}

export const Verify = async token => { 
    if (!token) return null;
    const verified = await jwt.verify(token, process.env.JWT_SECRET);
    return verified;
}