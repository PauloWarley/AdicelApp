import { useRouter } from 'next/router'


export default function Logout(req, res) { 

    const blacklist = []

    const token = req.headers["x-acces-token"]

    res.end()

    

}