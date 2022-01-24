// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  

  var obj =  `    
    <svg viewBox="0 0 50 50">
          <rect width="10" height="10" fill="green">
              <animate attributeName="rx" values="0;20;0"
                  dur="2s" repeatCount="10" />
          </rect>
    </svg>
    `
  

  res.setHeader("Content-Type", "text/html")

  res.end(obj)


}
