/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../contexts/errors/AuthTokenError";

export function withSSRAuth<P extends { [key: string]: any }>(
  fn: GetServerSideProps<P>
): GetServerSideProps {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    const token = cookies["b4you.token"];

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) destroyCookie(ctx, "b4you.token");

      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  };
}
