import dynamic from 'next/dynamic'
import React, { useState } from "react";
import parse from 'html-react-parser';
import axios from 'axios';


const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})




const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
]

function  onSubmit (value) {
console.log(value)

  value = "select * from usuarios"
  let data={query : value}

    axios.post('../api/', data)
    .then((response) => {
      console.log(response)
})
.catch((e) => { console.log(e)}
)}

export default function Home() {
  const [value, setValue] = useState('');

    //console.log("ENV", process.env)

  return (
    <div>
  <QuillNoSSRWrapper modules={modules} placeholder='compose here' value={value} onChange={setValue} formats={formats} theme="snow"  />
 <button onClick={e => onSubmit(value)} > Send post</button>
  <p>{value}</p>
  {parse(value)}
  </div>
  )}