
import { Link } from "react-router-dom";
import { AuthNavbar } from "@/components/layout/AuthNavbar";
import Footer from "@/components/layout/Footer";
import ServiceCard from "@/components/home/ServiceCard";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const services = [
    {
      icon: "https://placehold.co/200?text=👨‍💻",
      title: "Freelance",
      description: "จ้างฟรีแลนซ์มืออาชีพในทุกสาขา ได้งานมีคุณภาพ ชำระเงินง่ายด้วยคริปโต",
      link: "/freelance-services"
    },
    {
      icon: "https://placehold.co/200?text=🏠",
      title: "Marketplace",
      description: "ซื้อ ขาย เช่า รถและอสังหาริมทรัพย์ ปลอดภัย มั่นใจ ด้วยระบบ Smart Contract",
      link: "/buy-sell-marketplace"
    },
    {
      icon: "https://placehold.co/200?text=✈️",
      title: "Reservations",
      description: "จองตั๋วเครื่องบินและโรงแรมทั่วโลก ราคาพิเศษเมื่อชำระด้วยคริปโต",
      link: "/travel-reservations"
    },
    {
      icon: "https://placehold.co/200?text=🗺️",
      title: "Map",
      description: "ค้นหาร้านค้าที่รับชำระด้วยคริปโตใกล้คุณ ง่ายและสะดวก",
      link: "/crypto-store-map"
    },
    {
      icon: "https://placehold.co/200?text=🔐",
      title: "Verify",
      description: "ตรวจสอบและยืนยันตัวตนด้วยระบบที่ปลอดภัย รองรับ KYC/AML",
      link: "/identity-verification"
    }
  ];

  return (
    <>
      <Helmet>
        <title>INFIWORLD - ซื้อ ขาย เช่า จอง ด้วยคริปโตและบัตร</title>
        <meta name="description" content="แพลตฟอร์มครบวงจรที่รองรับการซื้อขายด้วยเงินสด บัตรเครดิต และคริปโตเคอเรนซี" />
        <meta name="keywords" content="คริปโต, บล็อกเชน, ฟรีแลนซ์, อสังหาริมทรัพย์, จองตั๋วเครื่องบิน, marketplace, เงินดิจิทัล" />
        <link rel="canonical" href={window.location.origin + "/"} />
      </Helmet>

      <AuthNavbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-infi-dark to-infi-green text-white py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-12 md:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  INFIWORLD: ซื้อ ขาย เช่า จอง ด้วยคริปโตและบัตร
                </h1>
                <p className="text-xl mb-8">
                  แพลตฟอร์มครบวงจรที่รองรับการซื้อขายด้วยเงินสด บัตรเครดิต และคริปโตเคอเรนซี เพื่อตอบโจทย์ทุกความต้องการในโลกดิจิตอล
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to="/freelance-services" className="btn-primary text-center">
                    เริ่มต้นใช้งาน
                  </Link>
                  <a href="#services" className="btn-secondary text-center">
                    ดูบริการของเรา
                  </a>
                </div>
              </div>
              <div className="md:w-1/2 md:pl-8">
                <div className="relative">
                  <div className="animate-float">
                    <img 
                      src="https://placehold.co/600x400?text=INFIWORLD+Platform+Preview" 
                      alt="INFIWORLD Platform" 
                      className="rounded-lg shadow-2xl"
                    />
                  </div>
                  <div className="absolute -bottom-5 -right-5 bg-white p-3 rounded-lg shadow-lg hidden md:block">
                    <div className="flex items-center">
                      <img src="https://placehold.co/40?text=₿" alt="Cryptocurrency" className="w-8 h-8 mr-2" />
                      <div>
                        <p className="text-infi-dark font-semibold">Crypto Ready</p>
                        <p className="text-xs text-infi-gray">รองรับการชำระเงินด้วยคริปโต</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">บริการของเรา</h2>
              <p className="text-lg text-infi-gray max-w-2xl mx-auto">
                ค้นพบบริการครบวงจรของ INFIWORLD ที่รองรับทั้งการชำระเงินแบบดั้งเดิมและคริปโตเคอเรนซี
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard 
                  key={index} 
                  icon={service.icon} 
                  title={service.title} 
                  description={service.description}
                  link={service.link}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">ทำไมต้อง INFIWORLD?</h2>
              <p className="text-lg text-infi-gray max-w-2xl mx-auto">
                เราพัฒนาแพลตฟอร์มที่ปลอดภัย สะดวกสบาย และรองรับเทคโนโลยีสมัยใหม่
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-infi-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <img src="https://placehold.co/200?text=🔒" alt="Security Icon" className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">ปลอดภัยสูงสุด</h3>
                <p className="text-infi-gray">
                  ระบบความปลอดภัยมาตรฐานสากล รองรับ KYC และ AML ข้อมูลของคุณจะถูกเก็บอย่างปลอดภัย
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-infi-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <img src="https://placehold.co/200?text=💲" alt="Payment Icon" className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">หลากหลายวิธีชำระเงิน</h3>
                <p className="text-infi-gray">
                  รองรับทั้งบัตรเครดิต/เดบิต เงินสด และคริปโตเคอเรนซีหลากหลายสกุล
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-infi-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <img src="https://placehold.co/200?text=⚡" alt="Speed Icon" className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">รวดเร็ว ทันใจ</h3>
                <p className="text-infi-gray">
                  ธุรกรรมทั้งหมดเสร็จสิ้นภายในไม่กี่นาที ไม่ต้องรอนาน
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-infi-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <img src="https://placehold.co/200?text=🌐" alt="Global Icon" className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">ใช้งานได้ทั่วโลก</h3>
                <p className="text-infi-gray">
                  ไม่มีข้อจำกัดด้านพรมแดน ใช้บริการได้ทุกที่ทั่วโลก
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-infi-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <img src="https://placehold.co/200?text=👨‍💻" alt="Support Icon" className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">ซัพพอร์ต 24/7</h3>
                <p className="text-infi-gray">
                  ทีมงานพร้อมให้บริการและช่วยเหลือตลอด 24 ชั่วโมงทุกวัน
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-infi-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <img src="https://placehold.co/200?text=📱" alt="Mobile Icon" className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">ใช้งานได้ทุกอุปกรณ์</h3>
                <p className="text-infi-gray">
                  รองรับการใช้งานบนคอมพิวเตอร์ แท็บเล็ต และสมาร์ทโฟนทุกรุ่น
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-infi-green py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">พร้อมเริ่มต้นใช้งานแล้วหรือยัง?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              สมัครสมาชิกฟรีวันนี้ และเริ่มต้นใช้งานบริการครบวงจรของ INFIWORLD
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/auth" className="btn-primary bg-white text-infi-green hover:bg-gray-100">
                สมัครสมาชิก
              </Link>
              <a href="#services" className="btn-secondary border-white text-white hover:bg-white hover:text-infi-green">
                ดูบริการเพิ่มเติม
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
