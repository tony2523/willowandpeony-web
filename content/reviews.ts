/**
 * Google reviews for Willow & Peony — captured verbatim from the Google
 * Business Profile (5.0 rating, 14 reviews, checked 2026-10-01).
 * Update by re-reading the profile; keep text word-for-word.
 */

export const googleRating = {
  value: 5.0,
  count: 14,
  url: "https://www.google.com/maps/place/Willow+%26+Peony/@-40.9248354,175.0039087,5z/data=!4m8!3m7!1s0x8d95dd180f870329:0xde0bcd87c7f0c74b!8m2!3d-40.9248354!4d175.0039087!9m1!1b1!16s%2Fg%2F11yc0dq6ht",
} as const;

export type Review = {
  name: string;
  when: string; // month captured, approximate
  text: string;
  /** Which pages this review suits best. */
  kind: "wedding" | "event" | "general";
  /** Shorter pull for the slider; full text shown on request/detail. */
  short?: string;
};

export const reviews: Review[] = [
  {
    name: "Siu Vea",
    when: "September 2026",
    kind: "wedding",
    text: "We had such a great experience with Ivy for my sister’s wedding! She was easy to work with, really patient with all the back and forth, and always so kind and accommodating. We had a budget we needed to stick to and she was really helpful with working around that while still making everything look beautiful. I didn’t really know what I wanted half the time but she was so good at taking our ideas and bringing them together in a way that made sense. The flowers on the day were absolutely beautiful. So happy we went with Willow and Peony. Highly recommend!",
    short:
      "We had a budget we needed to stick to and she was really helpful with working around that while still making everything look beautiful. The flowers on the day were absolutely beautiful.",
  },
  {
    name: "Caro C",
    when: "September 2026",
    kind: "event",
    text: "Everytime I have an event in NZ I always choose Ivy. She is incredible and does the most amazing arrangements for me. Outside of the box and incredibly interesting. She is so talented. She nails the brief every time and goes above and beyond. I love working with her.",
    short:
      "Everytime I have an event in NZ I always choose Ivy. Outside of the box and incredibly interesting. She nails the brief every time and goes above and beyond.",
  },
  {
    name: "Joanne Shi",
    when: "July 2026",
    kind: "wedding",
    text: "She designed a wedding for me that I will remember for the rest of my life. From the initial floral design, table styling, and creative wedding favors, to the on-site setup on the wedding day, she put her heart into every detail. Her attention to detail and commitment to quality aligned perfectly with my vision and expectations. She always put herself in my shoes and pointed out so many important details that I would never have thought of on my own. Thanks to her professionalism, creativity, and dedication, my wedding planning stress was greatly reduced, and in the end, I had a unique and absolutely perfect wedding. If you’re planning a wedding, I cannot recommend her highly enough.",
    short:
      "She designed a wedding for me that I will remember for the rest of my life. She put her heart into every detail — in the end, I had a unique and absolutely perfect wedding.",
  },
  {
    name: "Lizhu Yu",
    when: "June 2026",
    kind: "wedding",
    text: "Thank you for Ivy's amazing work. From the initial contact, to the plan revisions, and then the venue setup, Ivy demonstrated her professionalism every step of the way. Our wedding couldn't have gone so smoothly without you. You are the best florist!",
  },
  {
    name: "Leah Schemel",
    when: "June 2026",
    kind: "wedding",
    text: "Ivy did an amazing job. The flower arrangements for our wedding just looked absolutely stunning and were exactly the way we wanted it. She also stayed through the whole ceremony to help move our flowers, that we had on the chairs close to the aisle, to the reception tables. We couldn't have wished for a better florist.",
  },
  {
    name: "Sarah Soon",
    when: "December 2025",
    kind: "wedding",
    text: "We are so blessed to have had Ivy as our florist for our big day. The entire experience from first contact, in-person meeting, communication along the way to the big day was treated with so much love and care. She took the time to get to know us, our vision for the day, and exceeded our expectations in her delivery of it. HIGHLY RECOMMEND!",
  },
  {
    name: "Jennifer Ivey",
    when: "December 2025",
    kind: "wedding",
    text: "Ivy was amazing to work with and made our wedding day beautiful! I would highly recommend this florist for your special day. We had several meetings and emails to ensure she saw my vision for the wedding and she totally understood what I wanted. The floral arrangements and bouquets for myself and the bridesmaids were stunning!",
  },
  {
    name: "Xenia Yau",
    when: "2025",
    kind: "wedding",
    text: "Ivy did a fantastic job for the floral arrangement for my wedding. There were a lot of compliments on the flower bouquet and centre pieces. Communication was consistent right up to the big day. Ivy was very helpful and she explained all the details thoroughly when we had our meeting regarding the flower options, colour theme and more. I highly recommend Willow and Peony.",
  },
  {
    name: "Yue Hu",
    when: "2025",
    kind: "wedding",
    text: "Ivy was absolutely amazing as our wedding florist! She is incredibly professional, organised, and has such a great eye for design. It was so easy to communicate with her throughout the whole process. Our wedding flower arrangements turned out beautifully — exactly what we hoped for and more. I highly recommend Ivy to anyone looking for a talented and reliable florist!",
  },
  {
    name: "Tony Hou",
    when: "2025",
    kind: "general",
    text: "I had the most wonderful experience with Willow and Peony, hands down one of the best florists in Auckland. Their floral arrangements are simply breathtaking — thoughtfully designed, lush, and bursting with colour and elegance. You can truly tell how much care and creativity goes into every bouquet.",
  },
  {
    name: "Fiona Marie",
    when: "2025",
    kind: "event",
    text: "Ivy’s arrangement evokes cheerfulness in a very elegant and aesthetically pleasing manner. She was very easy to communicate with despite my rather specific requests. Definitely have this place saved for future events!",
  },
  {
    name: "joochan park",
    when: "2025",
    kind: "general",
    text: "The best flowers in Auckland! Very well worth every cent I paid, exceeded expectations and excellent customer service. Delivery was made on the exact time requested. 100% satisfied. Anyone would be happy with these flowers.",
  },
  {
    name: "Chenxi Ling",
    when: "2025",
    kind: "general",
    text: "A great fresh flower birthday cake!",
  },
  {
    name: "Ziyun Tan",
    when: "2025",
    kind: "general",
    text: "Nice quality and delicate design!",
  },
];

/** Reviews with enough substance for the slider, per page flavour. */
export function sliderReviews(kind?: "wedding" | "event") {
  const substantial = reviews.filter((r) => r.text.length > 120);
  if (!kind) return substantial;
  const preferred = substantial.filter((r) => r.kind === kind);
  return preferred.length >= 3 ? preferred : substantial;
}
