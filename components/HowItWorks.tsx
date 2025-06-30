const HowItWorks = () => {
  return (
    <section className="container mx-auto pb-40 pt-20 px-4 bg-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">How It Works</h2>
        <p className="text-black max-w-md mx-auto">Three simple steps to create your universal payment profile</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white/5 p-8 rounded-3xl text-center">
          <div className="h-16 w-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-black font-bold text-2xl">1</span>
          </div>
          <h3 className="text-xl font-bold mb-3 text-black">Sign in with Google</h3>
          <p className="text-black">Quick and secure authentication with your Google account</p>
        </div>
        <div className="bg-white/5 p-8 rounded-3xl text-center">
          <div className="h-16 w-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-black font-bold text-2xl">2</span>
          </div>
          <h3 className="text-xl font-bold mb-3 text-black">Choose a username</h3>
          <p className="text-black">Pick your unique Billa username for your payment link</p>
        </div>
        <div className="bg-white/5 p-8 rounded-3xl text-center">
          <div className="h-16 w-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-black font-bold text-2xl">3</span>
          </div>
          <h3 className="text-xl font-bold mb-3 text-black">Add payment methods</h3>
          <p className="text-black">Connect your accounts and share your Billa link</p>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks; 