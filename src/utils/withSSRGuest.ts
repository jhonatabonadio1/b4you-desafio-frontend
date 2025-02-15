/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { parseCookies } from "nookies";

export function withSSRGuest<P extends { [key: string]: any }>(
  fn: GetServerSideProps<P>
): GetServerSideProps {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    if (cookies["incorporae.token"]) {
      return {
        redirect: {
          destination: "/documents",
          permanent: false,
        },
      };
    }

    return await fn(ctx);
  };
}
