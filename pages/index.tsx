import {GetServerSideProps} from "next";
import {authRedirect} from "../src/server/authRedirect";
import path from 'path';

path.resolve('./next.config.js');

export default function Home() {
  return <></>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    redirect: await authRedirect(ctx) ?? {
      destination: "/profile",
    },
    props: {}
  };
}