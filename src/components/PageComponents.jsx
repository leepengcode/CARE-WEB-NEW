export default function PageComponents({ children }) {
  return (
    <>
      <main>
        <div className=" max-w-7xl mx-auto px-4  sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </>
  );
}
