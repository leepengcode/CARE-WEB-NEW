export default function PageComponents({ children }) {
  return (
    <>
      <main>
        <div className=" max-w-8xl mx-auto px-2  sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </>
  );
}
