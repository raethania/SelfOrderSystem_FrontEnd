
type HeaderProp = {
  title : string,
  body : string
}

export default function Header({title, body} : HeaderProp) {
  return (

    <div className="mb-5">
        <h1 className="text-3xl text-center mb-3 font-bold">{title}</h1>
        <p className="text-center">{body} <a href={title == "Register"? '/login': '/register'} className="text-blue-700 underline">{title == "Register"? 'Sign in': 'Sign up'}</a></p>
    </div>
  )
}
