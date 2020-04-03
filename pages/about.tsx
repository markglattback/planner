import checkAuth from '../lib/checkAuth';
import Link from 'next/link';

const About = (props) => {
  console.log(props);
  
  return <div>
    <h1>About Page</h1>
    <Link href="/"><a>Home</a></Link>
  </div>;
}

export async function getServerSideProps(context) {
  return checkAuth(context);
}

export default About;