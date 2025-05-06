import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "K Madhavi",
      role: "Patient",
      image: "https://previews.123rf.com/images/dragonimages/dragonimages1805/dragonimages180500578/101103129-cheerful-elderly-indian-woman.jpg",
      content: "The dental care I received was exceptional. The staff was professional and caring, making my experience comfortable and stress-free.",
      rating: 5
    },
    {
      id: 2,
      name: "S Chakrapani",
      role: "Patient",
      image: "https://thumbs.dreamstime.com/b/smiling-indian-man-looking-camera-mature-wearing-spectacles-portrait-middle-eastern-confident-businessman-office-195195079.jpg",
      content: "Outstanding service and state-of-the-art facilities. The dentists here truly care about their patients' well-being.",
      rating: 5
    },
    {
      id: 3,
      name: "Alice Sandhya",
      role: "Patient",
      image: "https://t4.ftcdn.net/jpg/03/17/72/03/360_F_317720355_sn87YEwDHHGMMYYmxiS3o3Hinkt1T3sB.jpg",
      content: "I've never felt more confident about my smile. The team here is amazing and the results speak for themselves!",
      rating: 5
    }
  ];

  return (
    <section className="py-10 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="reveal-on-scroll inline-block px-3 py-1 mb-6 bg-sociodent-100 text-sociodent-700 rounded-full text-sm font-medium">
            Testimonials
          </span>
          <h2 className="reveal-on-scroll text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            What Our Patients Say
          </h2>
          <p className="reveal-on-scroll text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences from our valued patients who trust us with their dental care
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="reveal-on-scroll glass-card rounded-2xl p-6 bg-white"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-sociodent-500 text-sociodent-500"
                  />
                ))}
              </div>

              <p className="text-gray-600">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;