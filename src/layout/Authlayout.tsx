import { type ReactNode } from 'react';

type AuthLayoutProp = {
  children: ReactNode
}

export default function Authlayout({ children }: AuthLayoutProp) {
  return (
    <div className="grid grid-cols-1 grid-rows-3 md:grid-rows-1 md:grid-cols-3 h-dvh">
      <section className="bg-no-repeat bg-cover flex flex-col justify-between p-10 h-full bg-[url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] ">
        <h1 className="text-white text-2xl font-semibold">Numbas</h1>
        <p className="text-white text-2xl">Smart way <br /> to order food <br /> from your table</p>
      </section>
      <section className="row-span-2 md:row-span-1 md:col-span-2 flex justify-center items-center gap-5">
        <div className="p-10">
          {children}
        </div>
      </section>
    </div>
  )
}
