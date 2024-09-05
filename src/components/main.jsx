import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
  };

  const slides = [
    {
      image: "/assets/hero_iphone_family_a__c7v3mvx3jv42_largetall.jpg",
      title: "iPhone 15 Pro",
      subtitle: "Titanium. So strong. So light. So Pro.",
      buttonText: "Learn more",
      link: "/product/iphone-15-pro",
      textColor: "#f5f5f7",
    },
    {
      image: "/assets/promo_apple_watch_series_9_order__b3u85rm9zf6u_large.jpg",
      title: "WATCH",
      subtitle: "Smarter. Brighter. Mightier.",
      buttonText: "Order now",
      link: "/product/apple-watch",
      textColor: "#f5f5f7",
    },
    {
      image: "/assets/promo_ai__couihqxznyvm_large.jpg",
      title: "MacBook Air 15",
      subtitle: "Impressively big. Impossibly thin.",
      buttonText: "Learn more",
      link: "/product/macbook-air",
      textColor: "#1d1d1f",
    },
  ];

  return (
    <div className="hero-slider">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="hero-slide">
            <img src={slide.image} alt={slide.title} className="hero-image" />
            <div className="hero-content" style={{ color: slide.textColor }}>
              <h2>{slide.title}</h2>
              <p>{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider;
