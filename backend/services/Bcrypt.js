import bcrypt from 'bcryptjs';


export const Hash = data => {
    return bcrypt.hash(data,10)
}

export const Compare = (original,hashed) => {
    return bcrypt.compare(original,hashed)
}