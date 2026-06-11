export interface Product {
  id: string;
  name: string;
  brand: 'Canon' | 'Nikon' | 'Sony' | 'Fujifilm' | 'Lenses' | 'OM System' | 'Flycam' | 'Action Camera' | 'Gimbal' | 'Micro' | 'Phụ kiện' | 'Skin';
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  description: string;
  specs: { [key: string]: string };
}

export const brandBanners = {
  Canon: {
    title: 'TOP MÁY ẢNH CANON "HOT"',
    subtitle: 'PowerShot V1 & EOS R50',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
  },
  Nikon: {
    title: 'TOP MÁY ẢNH NIKON "HOT"',
    subtitle: 'Nikon Z50 II & Z fc Series',
    image: 'https://images.unsplash.com/photo-1616448244355-513501f0ae1d?w=800&auto=format&fit=crop&q=80',
  },
  Sony: {
    title: 'TOP MÁY ẢNH SONY "HOT"',
    subtitle: 'Chinh phục mọi khoảnh khắc cùng Sony Alpha',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
  },
  Fujifilm: {
    title: 'TOP MÁY ẢNH FUJIFILM "HOT"',
    subtitle: 'Màu sắc cổ điển, công nghệ hiện đại',
    image: 'https://images.unsplash.com/photo-1519638396416-e5a9e52e847d?w=800&auto=format&fit=crop&q=80',
  },
  Lenses: {
    title: 'TOP ỐNG KÍNH "HOT"',
    subtitle: 'Nâng tầm chất lượng ảnh chụp với lens cao cấp',
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=80',
  },
  'OM System': {
    title: 'OM SYSTEM / OLYMPUS',
    subtitle: 'Hệ máy ảnh Micro Four Thirds siêu bền bỉ',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
  },
  Flycam: {
    title: 'FLYCAM DJI CHÍNH HÃNG',
    subtitle: 'Bay cao, ghi hình sắc nét cùng DJI Mavic & Mini',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
  },
  'Action Camera': {
    title: 'ACTION CAMERA',
    subtitle: 'Ghi lại mọi khoảnh khắc hành động',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
  },
  Gimbal: {
    title: 'GIMBAL CHỐNG RUNG',
    subtitle: 'Thước phim mượt mà chuyên nghiệp',
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=80',
  },
  Micro: {
    title: 'MICRO ÂM THANH',
    subtitle: 'Thu âm đỉnh cao, lọc ồn hoàn hảo',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
  },
  'Phụ kiện': {
    title: 'PHỤ KIỆN MÁY ẢNH',
    subtitle: 'Chân máy, thẻ nhớ, túi đựng cao cấp',
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=80',
  },
  Skin: {
    title: 'SKIN DÁN MÁY ẢNH',
    subtitle: 'Bảo vệ máy ảnh cá tính',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
  },
};

export const products: Product[] = [
  // CANON
  {
    id: 'canon-r50',
    name: 'Máy ảnh EOS Canon R50 (Body Black) | Chính hãng',
    brand: 'Canon',
    price: 15790000,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 12,
    description: 'Canon EOS R50 là chiếc máy ảnh mirrorless dòng APS-C cực kỳ nhỏ gọn, thích hợp cho các vlogger và người sáng tạo nội dung. Máy hỗ trợ quay video 4K 30p (oversampled từ 6K) cùng hệ thống lấy nét Dual Pixel CMOS AF II thông minh.',
    specs: {
      'Cảm biến': 'APS-C CMOS 24.2 Megapixel',
      'Bộ xử lý': 'DIGIC X',
      'Lấy nét': 'Dual Pixel CMOS AF II (Phát hiện người, động vật, phương tiện)',
      'Quay video': '4K 30p, Full HD 120p',
      'Chụp liên tiếp': 'Tối đa 15 hình/giây',
      'Trọng lượng': '375g (cả pin và thẻ nhớ)',
    }
  },
  {
    id: 'canon-g7x-iii-ltd',
    name: 'Máy ảnh Canon PowerShot G7 X Mark III (30th Anniversary Limited Edition Kit) | Chính hãng',
    brand: 'Canon',
    price: 33490000,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 5,
    badge: 'Limited',
    description: 'Phiên bản kỷ niệm 30 năm giới hạn đi kèm bộ phụ kiện cao cấp. Canon PowerShot G7 X Mark III mang đến chất lượng hình ảnh vượt trội với cảm biến Stacked CMOS 1 inch, khả năng livestream trực tiếp lên YouTube và cổng mic 3.5mm tiện dụng.',
    specs: {
      'Cảm biến': '1.0-inch Stacked CMOS 20.1 Megapixel',
      'Ống kính': '24-100mm f/1.8-2.8 (Zoom quang học 4.2x)',
      'Bộ xử lý': 'DIGIC 8',
      'Quay video': '4K 30p không bị crop, Full HD 120p',
      'Kết nối': 'Wi-Fi, Bluetooth, Livestream trực tiếp YouTube',
    }
  },
  {
    id: 'canon-g7x-iii-black',
    name: 'Máy ảnh Canon PowerShot G7 X Mark III (Black) | Chính hãng',
    brand: 'Canon',
    price: 28490000,
    originalPrice: 33390000,
    image: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 38,
    badge: 'Giảm giá!',
    description: 'Dòng máy ảnh compact huyền thoại dành cho Vlogger. Máy sở hữu cảm biến 1 inch, ống kính khẩu độ lớn f/1.8-2.8 và bộ vi xử lý DIGIC 8 mạnh mẽ giúp bắt trọn mọi khoảnh khắc thiếu sáng.',
    specs: {
      'Cảm biến': '1.0-inch Stacked CMOS 20.1 Megapixel',
      'Ống kính': '24-100mm f/1.8-2.8',
      'Bộ xử lý': 'DIGIC 8',
      'Quay video': '4K 30p, Full HD 120p',
      'Tính năng': 'Hỗ trợ livestream, màn hình lật xoay 180 độ',
    }
  },
  {
    id: 'canon-r5-ii',
    name: 'Máy ảnh Canon EOS R5 Mark II | Chính hãng',
    brand: 'Canon',
    price: 88990000,
    image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=500&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviews: 3,
    badge: 'Hot',
    description: 'Siêu phẩm mirrorless full-frame thế hệ mới của Canon. Tích hợp cảm biến Back-Illuminated Stacked CMOS 45MP, hệ thống lấy nét đột phá hỗ trợ bởi AI và khả năng quay video 8K 60p RAW chuyên nghiệp.',
    specs: {
      'Cảm biến': 'Full-frame Back-Illuminated Stacked CMOS 45 Megapixel',
      'Bộ xử lý': 'DIGIC Accelerator + DIGIC X',
      'Lấy nét': 'Dual Pixel Intelligent AF (Lấy nét bằng mắt cải tiến)',
      'Quay video': '8K 60p RAW, 4K 120p',
      'Chụp liên tiếp': 'Tối đa 30 hình/giây (màn trập điện tử)',
    }
  },

  // NIKON
  {
    id: 'nikon-z50-ii',
    name: 'Máy ảnh Nikon Z50 II + Lens Kit 16-50mm',
    brand: 'Nikon',
    price: 27990000,
    originalPrice: 29990000,
    image: 'https://images.unsplash.com/photo-1616448244355-513501f0ae1d?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 8,
    badge: 'Giảm giá!',
    description: 'Nikon Z50 II là người bạn đồng hành hoàn hảo cho nhiếp ảnh gia đường phố và vlogger. Đi kèm ống kính kit 16-50mm nhỏ gọn và khả năng lấy nét tự động chính xác cùng chế độ màu Picture Control phong phú.',
    specs: {
      'Cảm biến': 'APS-C CMOS 20.9 Megapixel',
      'Bộ xử lý': 'EXPEED 7',
      'Lấy nét': 'Phát hiện chủ thể thông minh (9 loại đối tượng)',
      'Quay video': '4K UHD 60p (crop), 4K 30p oversampled từ 5.6K',
      'Ống kính đi kèm': 'NIKKOR Z DX 16-50mm f/3.5-6.3 VR',
    }
  },
  {
    id: 'nikon-z30',
    name: 'Máy ảnh Nikon Z30 + Lens Kit 16-50mm',
    brand: 'Nikon',
    price: 27990000,
    image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=500&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviews: 14,
    description: 'Chiếc máy ảnh dòng Z nhỏ nhất và nhẹ nhất được tối ưu riêng cho việc quay vlog. Không có kính ngắm điện tử giúp tối giản kích thước, màn hình lật cảm ứng hỗ trợ selfie dễ dàng.',
    specs: {
      'Cảm biến': 'APS-C CMOS 20.9 Megapixel',
      'Bộ xử lý': 'EXPEED 6',
      'Màn hình': 'Cảm ứng lật xoay 3.0-inch',
      'Quay video': '4K UHD 30p không crop, Full HD 120p',
      'Ghi âm': 'Micro stereo tích hợp với bộ lọc gió',
    }
  },
  {
    id: 'nikon-zfc-28',
    name: 'Máy ảnh Nikon Z fc + Lens Kit 28mm f/2.8',
    brand: 'Nikon',
    price: 28190000,
    originalPrice: 30990000,
    image: 'https://images.unsplash.com/photo-1519638396416-e5a9e52e847d?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 11,
    badge: 'Giảm giá!',
    description: 'Mang kiểu dáng cổ điển hoài niệm của dòng máy film Nikon FM2 huyền thoại kết hợp với công nghệ ngàm Z tiên tiến. Đi kèm ống kính tiêu cự đơn 28mm f/2.8 thời thượng.',
    specs: {
      'Cảm biến': 'APS-C CMOS 20.9 Megapixel',
      'Thiết kế': 'Retro cổ điển bằng hợp kim magie',
      'Bộ xử lý': 'EXPEED 6',
      'Ống kính đi kèm': 'NIKKOR Z 28mm f/2.8 (SE)',
      'Quay video': '4K UHD 30p',
    }
  },
  {
    id: 'nikon-zfc-16-50',
    name: 'Máy ảnh Nikon Z fc + Lens Kit 16-50mm',
    brand: 'Nikon',
    price: 26290000,
    originalPrice: 28290000,
    image: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 21,
    badge: 'Giảm giá!',
    description: 'Sự kết hợp hoàn hảo giữa phong cách hoài cổ phong trần và ống kính zoom đa dụng 16-50mm siêu mỏng nhẹ. Thích hợp cho cả chụp ảnh phong cảnh, chân dung và quay vlog hàng ngày.',
    specs: {
      'Cảm biến': 'APS-C CMOS 20.9 Megapixel',
      'Ống kính': 'NIKKOR Z DX 16-50mm f/3.5-6.3 VR (Bản màu bạc)',
      'Lấy nét': 'Eye-Detection AF cho người và động vật',
      'Màn hình': 'Màn hình cảm ứng xoay lật đa góc',
    }
  },

  // SONY
  {
    id: 'sony-a7iv',
    name: 'Máy ảnh Sony Alpha A7 IV Body Only | Chính hãng',
    brand: 'Sony',
    price: 67990000,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 45,
    badge: 'Bán chạy',
    description: 'Sony A7 IV định nghĩa lại tiêu chuẩn cho dòng máy ảnh lai (Hybrid) với cảm biến Full-frame 33MP, hệ thống lấy nét thời gian thực (Real-time Eye AF) cho người, động vật và chim chóc, cùng khả năng quay phim 4K 60p 10-bit 4:2:2.',
    specs: {
      'Cảm biến': 'Full-frame Exmor R CMOS 33 Megapixel',
      'Bộ xử lý': 'BIONZ XR',
      'Lấy nét': '759 điểm lấy nét theo pha PDAF, Real-time tracking',
      'Quay video': '4K 60p (Super 35), 4K 30p (oversampled từ 7K) 10-bit 4:2:2',
      'Chống rung': 'SteadyShot 5 trục trong thân máy, hiệu quả 5.5 stops',
    }
  },
  {
    id: 'sony-a7c',
    name: 'Máy ảnh Sony Alpha A7C Body | Chính hãng',
    brand: 'Sony',
    price: 38990000,
    image: 'https://images.unsplash.com/photo-1597200381847-30ec200eeb9b?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 32,
    description: 'Dòng máy ảnh full-frame nhỏ gọn nhất thế giới tích hợp chống rung 5 trục. Sony A7C mang đến hiệu năng vượt trội của cảm biến full-frame trong một thân máy nhỏ nhẹ tương đương dòng crop APS-C.',
    specs: {
      'Cảm biến': 'Full-frame Exmor R CMOS 24.2 Megapixel',
      'Bộ xử lý': 'BIONZ X',
      'Chống rung': 'Chống rung 5 trục trong thân máy (5.0 stops)',
      'Màn hình': 'Xoay lật đa góc mở sang bên cạnh',
      'Thời lượng pin': 'Cực kỳ ấn tượng với pin NP-FZ100 (khoảng 740 ảnh)',
    }
  },
  {
    id: 'sony-a6700',
    name: 'Máy ảnh Sony Alpha A6700 Body | Chính hãng',
    brand: 'Sony',
    price: 35990000,
    image: 'https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 16,
    badge: 'Hot',
    description: 'Flagship APS-C thế hệ mới nhất của Sony sở hữu cảm biến BSI CMOS 26MP, chip xử lý AI chuyên biệt giúp nhận diện chủ thể cực kỳ thông minh, cùng các tính năng quay phim chuyên nghiệp từ dòng Cinema Line.',
    specs: {
      'Cảm biến': 'APS-C Exmor R CMOS BSI 26 Megapixel',
      'Bộ xử lý': 'BIONZ XR + Bộ xử lý AI chuyên dụng',
      'Lấy nét': 'Phát hiện chủ thể bằng AI (Người, Động vật, Chim, Côn trùng, Xe cộ, Máy bay)',
      'Quay video': '4K 120p (crop 1.6x), 4K 60p oversampled từ 6K 10-bit',
    }
  },
  {
    id: 'sony-a6400',
    name: 'Máy ảnh Sony Alpha A6400 Body | Chính hãng',
    brand: 'Sony',
    price: 18990000,
    image: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 112,
    description: 'Chiếc máy ảnh quốc dân cho người mới bắt đầu và các vlogger tầm trung. Hệ thống lấy nét siêu tốc 0.02s cùng màn hình lật 180 độ phía trên tiện lợi cho việc chụp ảnh và quay video tự quay.',
    specs: {
      'Cảm biến': 'APS-C Exmor CMOS 24.2 Megapixel',
      'Lấy nét': '425 điểm lấy nét, Real-time Eye AF',
      'Màn hình': 'Cảm ứng lật lên 180 độ',
      'Quay video': '4K HDR (HLG) 30p, quay Slow-motion Full HD 120fps',
    }
  },

  // FUJIFILM
  {
    id: 'fuji-xt5',
    name: 'Máy ảnh Fujifilm X-T5 Body | Chính hãng',
    brand: 'Fujifilm',
    price: 43490000,
    image: 'https://images.unsplash.com/photo-1519638396416-e5a9e52e847d?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 28,
    badge: 'Yêu thích',
    description: 'Fujifilm X-T5 tập trung sâu sắc vào nhiếp ảnh thuần túy với hệ thống vòng xoay cơ học cổ điển, cảm biến độ phân giải siêu cao X-Trans CMOS 5 HR 40.2MP cùng khả năng chống rung 5 trục 7 stops ấn tượng.',
    specs: {
      'Cảm biến': 'APS-C X-Trans CMOS 5 HR 40.2 Megapixel',
      'Bộ xử lý': 'X-Processor 5',
      'Giả lập phim': '19 chế độ giả lập màu phim độc quyền (Classic Chrome, Nostalgic Neg...)',
      'Chống rung': 'IBIS 5 trục hiệu quả lên đến 7.0 stops',
      'Quay video': '6.2K 30p 10-bit',
    }
  },
  {
    id: 'fuji-xt50',
    name: 'Máy ảnh Fujifilm X-T50 Body | Chính hãng',
    brand: 'Fujifilm',
    price: 35990000,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 7,
    badge: 'Mới',
    description: 'Thừa hưởng cảm biến 40MP và bộ xử lý hình ảnh X-Processor 5 từ dòng X-T5 cao cấp, X-T50 bổ sung thêm vòng xoay giả lập phim chuyên biệt trực tiếp trên thân máy giúp người dùng dễ dàng chuyển đổi màu sắc yêu thích.',
    specs: {
      'Cảm biến': 'APS-C X-Trans CMOS 5 HR 40.2 Megapixel',
      'Bộ xử lý': 'X-Processor 5',
      'Vòng xoay màu': 'Dial chọn giả lập phim chuyên dụng trên thân máy',
      'Chống rung': 'IBIS 5 trục hiệu quả 7.0 stops',
      'Quay video': '6.2K 30p, 4K 60p',
    }
  },
  {
    id: 'fuji-xt4',
    name: 'Máy ảnh Fujifilm X-T4 Body | Chính hãng',
    brand: 'Fujifilm',
    price: 32900000,
    image: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 64,
    description: 'Dòng máy ảnh cận chuyên nghiệp xuất sắc nhất một thời của Fujifilm. Vẫn cực kỳ giá trị ở thời điểm hiện tại với thiết kế đầm tay, pin lớn NP-W235, màn hình xoay lật đa góc và chống rung thân máy hoạt động hiệu quả.',
    specs: {
      'Cảm biến': 'APS-C X-Trans CMOS 4 26.1 Megapixel',
      'Bộ xử lý': 'X-Processor 4',
      'Chống rung': 'IBIS 5 trục hiệu quả 6.5 stops',
      'Quay video': '4K 60p 10-bit, F-Log tích hợp',
      'Chụp liên tiếp': 'Tối đa 15 hình/giây (màn trập cơ)',
    }
  },
  {
    id: 'fuji-xs20',
    name: 'Máy ảnh Fujifilm X-S20 Body | Chính hãng',
    brand: 'Fujifilm',
    price: 31990000,
    image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 19,
    badge: 'Đánh giá cao',
    description: 'Chiếc máy ảnh nhỏ gọn với báng cầm sâu thoải mái, tích hợp tính năng quay Vlog chuyên biệt (Vlog Mode), khả năng lấy nét tự động AI phát hiện nhiều đối tượng và pin dung lượng cực lớn NP-W235.',
    specs: {
      'Cảm biến': 'APS-C X-Trans CMOS 4 26.1 Megapixel',
      'Bộ xử lý': 'X-Processor 5',
      'Quay video': '6.2K 30p mở cổng open-gate, 4K 60p 10-bit',
      'Lấy nét': 'Phát hiện chủ thể AI thông minh',
      'Chế độ đặc biệt': 'Chế độ Product Priority (ưu tiên sản phẩm) dành cho review',
    }
  },

  // LENSES
  {
    id: 'lens-nikon-35',
    name: 'Ống kính Nikon NIKKOR Z 35mm f/1.4 | Chính hãng',
    brand: 'Lenses',
    price: 14890000,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 9,
    description: 'Ống kính tiêu cự đơn khẩu độ lớn f/1.4 đầu tiên thuộc dòng ống kính không chữ S của Nikon. Mang lại hiệu ứng xóa phông mượt mà, khả năng chụp thiếu sáng ấn tượng và độ sắc nét cao từ tâm ra rìa.',
    specs: {
      'Tiêu cự': '35mm (tương đương 52.5mm trên APS-C)',
      'Khẩu độ': 'f/1.4 - f/16',
      'Ngàm ống kính': 'Nikon Z-mount (Full-frame)',
      'Cấu tạo quang học': '11 thấu kính chia làm 9 nhóm (gồm 2 thấu kính phi cầu)',
      'Khối lượng': '415g',
    }
  },
  {
    id: 'lens-nikon-24-70',
    name: 'Ống kính Nikon NIKKOR Z 24-70mm f/2.8 S II | Chính hãng',
    brand: 'Lenses',
    price: 69000000,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviews: 4,
    badge: 'Cao cấp',
    description: 'Ống kính zoom đa dụng thuộc dòng S-Line cao cấp huyền thoại của Nikon. Sở hữu khẩu độ không đổi f/2.8, thấu kính tráng phủ lớp phủ Nano Crystal Coat và ARNEO giúp loại bỏ hoàn toàn hiện tượng bóng ma và lóa sáng.',
    specs: {
      'Tiêu cự': '24-70mm',
      'Khẩu độ': 'f/2.8 - f/22',
      'Ngàm': 'Nikon Z-mount (Full-frame / S-Line)',
      'Đặc điểm nổi bật': 'Có màn hình OLED hiển thị thông số trên thân lens, nút L-Fn gán tính năng',
      'Chống thời tiết': 'Kháng bụi và nước bắn toàn diện',
    }
  },
  {
    id: 'lens-nikon-16-50',
    name: 'Ống kính Nikon NIKKOR Z DX 16-50mm f/3.5-6.3 VR | Chính hãng',
    brand: 'Lenses',
    price: 12500000,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviews: 17,
    description: 'Ống kính zoom tiêu chuẩn siêu nhỏ gọn cơ chế thụt thò dành cho hệ máy ảnh APS-C ngàm Z. Tích hợp chống rung quang học VR lên đến 4.5 stops giúp ảnh chụp sắc nét hơn khi cầm tay.',
    specs: {
      'Tiêu cự': '16-50mm (tương đương 24-75mm trên full-frame)',
      'Khẩu độ': 'f/3.5 - f/16 (wide), f/6.3 - f/40 (tele)',
      'Chống rung': 'VR quang học tích hợp (4.5 stops)',
      'Trọng lượng': 'Chỉ 135g (siêu nhẹ)',
    }
  },
  {
    id: 'lens-nikon-12-28',
    name: 'Ống kính Nikon NIKKOR Z DX 12-28mm f/3.5-5.6 PZ VR | Chính hãng',
    brand: 'Lenses',
    price: 9200000,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 13,
    badge: 'Power Zoom',
    description: 'Ống kính zoom góc siêu rộng đầu tiên có tính năng Zoom điện tử (Power Zoom) của ngàm Z. Là lựa chọn tuyệt vời cho các vlogger muốn tự quay chụp góc rộng hoặc chụp phong cảnh kiến trúc.',
    specs: {
      'Tiêu cự': '12-28mm (tương đương 18-42mm trên full-frame)',
      'Khẩu độ': 'f/3.5 - f/5.6',
      'Cơ chế Zoom': 'Power Zoom điện tử (có thể zoom bằng remote hoặc nút gán)',
      'Khoảng cách lấy nét': '0.19m (cực kỳ thích hợp quay cận cảnh sản phẩm)',
    }
  },
  // OM SYSTEM
  {
    id: 'om-1-ii',
    name: 'Bộ máy ảnh OM SYSTEM OM-1 Mark II kèm ống kính M.Zuiko Digital ED 12-40mm F2.8 PRO II | Chính Hãng',
    brand: 'OM System',
    price: 66990000,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 10,
    description: 'OM-1 Mark II là flagship của OM SYSTEM sử dụng cảm biến Live MOS Stacked MFT 20.4MP, hỗ trợ chụp độ phân giải cao cầm tay 50MP và hệ thống chống rung Sync IS lên tới 8.5 stops.',
    specs: {
      'Cảm biến': 'Micro Four Thirds Stacked BSI Live MOS',
      'Độ phân giải': '20.4 Megapixel',
      'Bộ xử lý': 'TruePic X',
      'Chống rung': 'IBIS lên tới 8.5 stops',
    }
  },
  {
    id: 'om-3',
    name: 'Bộ máy ảnh OM SYSTEM OM-3 kèm ống kính M.Zuiko Digital ED 12-45mm F4 PRO | Chính Hãng',
    brand: 'OM System',
    price: 50990000,
    image: 'https://images.unsplash.com/photo-1616448244355-513501f0ae1d?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 6,
    description: 'Combo máy ảnh du lịch hoàn hảo với thân máy nhẹ, bền bỉ cùng ống kính zoom chuẩn PRO chống chịu thời tiết khắc nghiệt.',
    specs: {
      'Cảm biến': 'Live MOS MFT',
      'Ống kính': 'M.Zuiko Digital ED 12-45mm f/4 PRO',
      'Chống thời tiết': 'IP53 Dustproof & Splashproof',
    }
  },
  {
    id: 'om-d-m10-iv',
    name: 'Bộ máy ảnh OM SYSTEM OM-D E-M10 Mark IV kèm ống kính M.Zuiko Digital ED 14-42mm F3.5-5.6 EZ (Silver) | Chính Hãng',
    brand: 'OM System',
    price: 20990000,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 15,
    description: 'Máy ảnh mirrorless MFT siêu nhỏ gọn phong cách cổ điển, tích hợp màn hình lật chụp selfie và kết nối Wifi thông minh.',
    specs: {
      'Cảm biến': 'Live MOS 20 Megapixel',
      'Ống kính': 'M.Zuiko 14-42mm EZ',
      'Chống rung': '5 trục trong thân máy',
    }
  },
  // CANON ADDITIONS FROM SCREENSHOTS
  {
    id: 'canon-5d-iii',
    name: 'Máy ảnh Canon EOS 5D Mark III | Chính hãng',
    brand: 'Canon',
    price: 24900000,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 87,
    description: 'Dòng máy ảnh DSLR Full-frame chuyên nghiệp huyền thoại được các nhiếp ảnh gia dịch vụ tin dùng suốt nhiều năm.',
    specs: {
      'Cảm biến': 'Full-frame CMOS 22.3 Megapixel',
      'Lấy nét': '61 điểm AF',
      'ISO': '100 - 25600',
    }
  },
  {
    id: 'canon-5d-iv',
    name: 'Máy ảnh Canon EOS 5D Mark IV | Chính hãng',
    brand: 'Canon',
    price: 34900000,
    image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 54,
    description: 'Máy ảnh DSLR cao cấp độ phân giải 30.4MP, hỗ trợ lấy nét Dual Pixel CMOS AF cực nhanh khi chụp Live View và quay phim 4K.',
    specs: {
      'Cảm biến': 'Full-frame CMOS 30.4 Megapixel',
      'Quay video': '4K 30p',
      'ISO': '100 - 32000',
    }
  },
  {
    id: 'canon-60d',
    name: 'Máy ảnh Canon EOS 60D | Chính hãng',
    brand: 'Canon',
    price: 7900000,
    image: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=500&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviews: 140,
    description: 'Máy ảnh DSLR phân khúc tầm trung với màn hình xoay lật linh hoạt, chất lượng ảnh chụp sắc nét lý tưởng cho người mới bắt đầu.',
    specs: {
      'Cảm biến': 'APS-C CMOS 18 Megapixel',
      'Màn hình': 'Xoay lật 3.0 inch',
      'Chụp liên tiếp': '5.3 fps',
    }
  },
  {
    id: 'canon-6d',
    name: 'Máy ảnh Canon EOS 6D | Chính hãng',
    brand: 'Canon',
    price: 12900000,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviews: 98,
    description: 'Máy ảnh Full-frame giá tốt tích hợp GPS và Wifi đầu tiên của Canon, mang lại chất ảnh mượt mà trong tầm giá.',
    specs: {
      'Cảm biến': 'Full-frame CMOS 20.2 Megapixel',
      'Kết nối': 'Wifi, GPS tích hợp',
      'ISO': '100 - 25600',
    }
  },
  {
    id: 'canon-750d',
    name: 'Máy ảnh Canon EOS 750D | Chính hãng',
    brand: 'Canon',
    price: 8900000,
    image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=500&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviews: 120,
    description: 'Máy ảnh DSLR phổ thông nhỏ gọn với màn hình cảm ứng xoay lật, hỗ trợ kết nối Wifi và NFC tiện dụng.',
    specs: {
      'Cảm biến': 'APS-C CMOS 24.2 Megapixel',
      'Bộ xử lý': 'DIGIC 6',
      'Lấy nét': '19 điểm loại cross-type',
    }
  },
  {
    id: 'canon-80d',
    name: 'Máy ảnh Canon EOS 80D | Chính hãng',
    brand: 'Canon',
    price: 13900000,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 65,
    description: 'Máy ảnh DSLR bán chuyên lấy nét cực nhanh với hệ thống 45 điểm lấy nét cross-type và công nghệ Dual Pixel CMOS AF.',
    specs: {
      'Cảm biến': 'APS-C CMOS 24.2 Megapixel',
      'Lấy nét': '45 điểm cross-type',
      'Chụp liên tiếp': '7.0 fps',
    }
  },
  {
    id: 'canon-eos-r',
    name: 'Máy ảnh Canon EOS R Body | Chính hãng',
    brand: 'Canon',
    price: 29900000,
    image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 42,
    description: 'Chiếc máy ảnh Mirrorless Full-frame đầu tiên của hệ ngàm RF đột phá của Canon.',
    specs: {
      'Cảm biến': 'Full-frame CMOS 30.3 Megapixel',
      'Ngàm': 'Canon RF-mount',
      'Lấy nét': 'Dual Pixel CMOS AF',
    }
  },
  {
    id: 'canon-r1',
    name: 'Máy ảnh Canon EOS R1 | Chính hãng',
    brand: 'Canon',
    price: 170990000,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviews: 2,
    badge: 'Flagship',
    description: 'Siêu phẩm mirrorless full-frame thể thao, báo chí cao cấp nhất dòng EOS R của Canon với tốc độ xử lý đỉnh cao.',
    specs: {
      'Cảm biến': 'Stacked CMOS Back-Illuminated 24.2 MP',
      'Bộ xử lý': 'DIGIC Accelerator + DIGIC X',
      'Chụp liên tiếp': 'Tối đa 40 hình/giây',
    }
  },
  {
    id: 'canon-r10-18-150',
    name: 'Máy ảnh Canon EOS R10 + Lens RF-S 18-150mm f/3.5-6.3 IS STM | Chính Hãng',
    brand: 'Canon',
    price: 31990000,
    originalPrice: 33990000,
    image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 21,
    badge: 'Giảm giá!',
    description: 'Combo máy ảnh EOS R10 và ống kính zoom đa dụng dải tiêu cự rộng 18-150mm hoàn hảo cho mọi nhu cầu du lịch, phong cảnh.',
    specs: {
      'Cảm biến': 'APS-C CMOS 24.2 Megapixel',
      'Ống kính': 'RF-S 18-150mm IS STM',
      'Chụp liên tiếp': '23 fps (điện tử)',
    }
  },
  {
    id: 'canon-r10-18-45',
    name: 'Máy ảnh Canon EOS R10 + Lens RF-S 18-45mm F4.5-6.3 IS STM | Chính Hãng',
    brand: 'Canon',
    price: 21990000,
    originalPrice: 25990000,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 14,
    badge: 'Giảm giá!',
    description: 'Combo máy ảnh crop mirrorless EOS R10 kèm ống kính kit 18-45mm nhỏ gọn, thích hợp chụp ảnh gia đình, vlog.',
    specs: {
      'Cảm biến': 'APS-C CMOS 24.2 Megapixel',
      'Ống kính': 'RF-S 18-45mm IS STM',
    }
  },
  {
    id: 'canon-r10-body',
    name: 'Máy ảnh Canon EOS R10 | Chính Hãng',
    brand: 'Canon',
    price: 20490000,
    originalPrice: 22990000,
    image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 19,
    badge: 'Giảm giá!',
    description: 'Thân máy ảnh Mirrorless EOS R10 gọn nhẹ, lấy nét thông minh bắt nét mắt động vật và phương tiện.',
    specs: {
      'Cảm biến': 'APS-C CMOS 24.2 Megapixel',
      'Lấy nét': 'Dual Pixel CMOS AF II',
    }
  },
  {
    id: 'canon-r100-18-45',
    name: 'Máy ảnh Canon EOS R100 + Lens RF-S 18-45mm | Chính hãng',
    brand: 'Canon',
    price: 13490000,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviews: 11,
    description: 'Máy ảnh mirrorless rẻ nhất của Canon sở hữu cảm biến APS-C 24.1MP, ghi hình chất lượng cao kèm ống kính kit gọn nhẹ.',
    specs: {
      'Cảm biến': 'APS-C CMOS 24.1 Megapixel',
      'Ống kính': 'RF-S 18-45mm STM',
    }
  },
  {
    id: 'canon-r100-body',
    name: 'Máy ảnh Canon EOS R100 | Chính hãng',
    brand: 'Canon',
    price: 11690000,
    image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=500&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviews: 9,
    description: 'Thân máy EOS R100 siêu nhỏ nhẹ dễ dàng mang đi bất cứ đâu, chất ảnh DSLR chuyên nghiệp trong tầm tay.',
    specs: {
      'Cảm biến': 'APS-C CMOS 24.1 Megapixel',
      'Trọng lượng': 'Chỉ 356g',
    }
  },
  {
    id: 'canon-r3',
    name: 'Máy ảnh Canon EOS R3 | Chính hãng',
    brand: 'Canon',
    price: 109900000,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 12,
    badge: 'Pro',
    description: 'Máy ảnh mirrorless dòng chuyên nghiệp với cảm biến stacked 24MP, báng cầm dọc tích hợp và tính năng Eye Control AF độc đáo.',
    specs: {
      'Cảm biến': 'Stacked CMOS Full-frame 24 Megapixel',
      'Chống rung': 'Lên tới 8.0 stops',
      'Quay video': '6K RAW 60p',
    }
  },
  {
    id: 'canon-r5',
    name: 'Máy ảnh Canon EOS R5 | Chính hãng',
    brand: 'Canon',
    price: 72900000,
    image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 38,
    description: 'Máy ảnh fullframe đa năng 45MP nổi tiếng với khả năng quay video 8K và chụp liên tiếp 20fps.',
    specs: {
      'Cảm biến': 'Full-frame CMOS 45 Megapixel',
      'Quay video': '8K 30p, 4K 120p',
    }
  },
  {
    id: 'canon-r5c',
    name: 'Máy ảnh Canon EOS R5 C | Chính hãng',
    brand: 'Canon',
    price: 83900000,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 8,
    badge: 'Cinema',
    description: 'Phiên bản chuyên quay phim của dòng R5 huyền thoại, tích hợp quạt tản nhiệt chủ động cho thời gian quay video không giới hạn.',
    specs: {
      'Cảm biến': 'Full-frame CMOS 45 Megapixel',
      'Quay video': '8K 60p Cinema RAW Light',
      'Tản nhiệt': 'Quạt tích hợp chống quá nhiệt',
    }
  },

  // CANON LENSES (brand: 'Lenses')
  {
    id: 'lens-canon-10-20',
    name: 'Ống Kính Canon RF 10-20mm f/4 L IS STM | Chính hãng',
    brand: 'Lenses',
    price: 56990000,
    originalPrice: 68000000,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 14,
    badge: 'Giảm giá!',
    description: 'Ống kính zoom góc siêu rộng dòng L cao cấp tích hợp chống rung IS tiên tiến, hoàn hảo chụp kiến trúc, phong cảnh.',
    specs: {
      'Tiêu cự': '10-20mm',
      'Khẩu độ': 'f/4',
      'Ngàm': 'Canon RF',
    }
  },
  {
    id: 'lens-canon-100-300',
    name: 'Ống Kính Canon RF 100-300mm f/2.8 L IS USM | Chính hãng',
    brand: 'Lenses',
    price: 230990000,
    originalPrice: 232000000,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviews: 5,
    badge: 'Giảm giá!',
    description: 'Siêu ống kính zoom tele khẩu độ lớn f/2.8 toàn dải chuyên nghiệp cho thể thao và thế giới hoang dã.',
    specs: {
      'Tiêu cự': '100-300mm',
      'Khẩu độ': 'f/2.8',
      'Dòng': 'L-series Luxury',
    }
  },
  {
    id: 'lens-canon-100-400',
    name: 'Ống Kính Canon RF 100-400mm f/5.6-8 IS USM | Chính hãng',
    brand: 'Lenses',
    price: 15990000,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviews: 24,
    description: 'Ống kính zoom tele nhỏ nhẹ, giá tốt thích hợp chụp chim thú, thể thao ngoài trời.',
    specs: {
      'Tiêu cự': '100-400mm',
      'Chống rung': 'IS tích hợp',
    }
  },
  {
    id: 'lens-canon-100-500',
    name: 'Ống Kính Canon RF 100-500mm f/4.5-7.1 L IS USM | Chính hãng',
    brand: 'Lenses',
    price: 69990000,
    originalPrice: 70000000,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 32,
    badge: 'Giảm giá!',
    description: 'Ống kính siêu tele zoom chuyên nghiệp dòng L sắc nét vượt trội, chống bụi nước bắn.',
    specs: {
      'Tiêu cự': '100-500mm',
      'Khẩu độ': 'f/4.5-7.1',
    }
  },
  {
    id: 'lens-canon-100-macro',
    name: 'Ống Kính Canon RF 100mm f/2.8L Macro IS USM | Chính hãng',
    brand: 'Lenses',
    price: 24490000,
    originalPrice: 28000000,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 17,
    badge: 'Giảm giá!',
    description: 'Ống kính macro chuyên nghiệp phóng đại tối đa 1.4x tích hợp vòng tinh chỉnh bokeh vi sai sai số cầu SA.',
    specs: {
      'Tiêu cự': '100mm',
      'Độ phóng đại': '1.4x',
    }
  },
  {
    id: 'lens-canon-1200',
    name: 'Ống Kính Canon RF 1200mm f/8 L IS USM | Chính hãng',
    brand: 'Lenses',
    price: 483990000,
    originalPrice: 486000000,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviews: 1,
    badge: 'Giảm giá!',
    description: 'Siêu ống kính viễn vọng 1200mm đỉnh cao đắt giá dành riêng cho các dự án quan sát vũ trụ, động vật hoang dã.',
    specs: {
      'Tiêu cự': '1200mm',
      'Khẩu độ': 'f/8',
    }
  },
  {
    id: 'lens-canon-135',
    name: 'Ống Kính Canon RF 135mm f/1.8 L IS USM | Chính hãng',
    brand: 'Lenses',
    price: 51990000,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 16,
    description: 'Ống kính tiêu cự chân dung vàng f/1.8 cực kỳ sắc nét, xóa phông mịn màng bong bóng tròn trịa.',
    specs: {
      'Tiêu cự': '135mm',
      'Khẩu độ': 'f/1.8',
    }
  },
  {
    id: 'lens-canon-14-35',
    name: 'Ống Kính Canon RF 14-35mm f/4L IS USM | Chính hãng',
    brand: 'Lenses',
    price: 35990000,
    originalPrice: 38000000,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 22,
    badge: 'Giảm giá!',
    description: 'Ống kính zoom góc rộng đa dụng chất lượng cao cho phong cảnh và kiến trúc.',
    specs: {
      'Tiêu cự': '14-35mm',
      'Khẩu độ': 'f/4',
    }
  },
  {
    id: 'lens-canon-15-30',
    name: 'Ống Kính Canon RF 15-30mm f/4.5-6.3 IS STM | Chính hãng',
    brand: 'Lenses',
    price: 13990000,
    originalPrice: 15700000,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviews: 9,
    badge: 'Giảm giá!',
    description: 'Ống kính góc siêu rộng giá phổ thông dành cho người dùng EOS R dòng crop hoặc fullframe muốn góc rộng.',
    specs: {
      'Tiêu cự': '15-30mm',
    }
  },
  {
    id: 'lens-canon-15-35',
    name: 'Ống Kính Canon RF 15-35mm f/2.8L IS USM | Chính hãng',
    brand: 'Lenses',
    price: 46790000,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 40,
    description: 'Ống kính zoom góc siêu rộng khẩu lớn chuyên nghiệp f/2.8 dòng L huyền thoại của Canon.',
    specs: {
      'Tiêu cự': '15-35mm',
      'Khẩu độ': 'f/2.8',
    }
  },
  {
    id: 'lens-canon-16-28',
    name: 'Ống Kính Canon RF 16-28mm f/2.8 IS STM | Chính hãng',
    brand: 'Lenses',
    price: 28790000,
    originalPrice: 30700000,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 12,
    badge: 'Giảm giá!',
    description: 'Ống kính góc rộng đa dụng, khẩu độ f/2.8 cho khả năng chụp đêm ấn tượng.',
    specs: {
      'Tiêu cự': '16-28mm',
    }
  },
  {
    id: 'lens-canon-16-stm',
    name: 'Ống Kính Canon RF 16mm f/2.8 STM | Chính hãng',
    brand: 'Lenses',
    price: 8190000,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 58,
    description: 'Ống kính prime góc siêu rộng siêu hạt tiêu, là lựa chọn giá tốt nhất cho chụp phong cảnh góc rộng, vlog cầm tay.',
    specs: {
      'Tiêu cự': '16mm',
      'Khẩu độ': 'f/2.8',
      'Trọng lượng': '165g',
    }
  },

  // FLYCAM (brand: 'Flycam')
  {
    id: 'flycam-dji-air-3s-rc2',
    name: 'DJI Air 3S Fly More Combo (DJI RC 2) | Chính Hãng',
    brand: 'Flycam',
    price: 99990000,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 18,
    description: 'Dòng flycam tầm trung mới nhất của DJI với camera kép cao cấp, tay điều khiển DJI RC 2 tích hợp màn hình siêu sáng.',
    specs: {
      'Camera': 'Dual Camera (1-inch CMOS & 1/1.3-inch CMOS)',
      'Thời gian bay': 'Tối đa 46 phút',
      'Truyền hình ảnh': 'O4 HD 20km',
    }
  },
  {
    id: 'flycam-dji-air-3s-rcn3',
    name: 'DJI Air 3S Fly More Combo (DJI RC-N3) | Chính Hãng',
    brand: 'Flycam',
    price: 79990000,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 12,
    description: 'Bộ Fly More Combo đi kèm tay cầm RC-N3 tiêu chuẩn kết nối điện thoại thông minh.',
    specs: {
      'Thời gian bay': '46 phút',
      'Truyền sóng': 'O4 truyền hình ảnh HD',
    }
  },
  {
    id: 'flycam-dji-flip',
    name: 'DJI Flip | Chính Hãng',
    brand: 'Flycam',
    price: 15990000,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviews: 3,
    description: 'Flycam thế hệ mới với thiết kế cánh gập siêu độc đáo, ổn định trước gió cấp 5.',
    specs: {
      'Cân nặng': '249g',
      'Quay video': '4K UHD',
    }
  },
  {
    id: 'flycam-dji-flip-rcn3',
    name: 'DJI Flip (DJI RC-N3) | Chính Hãng',
    brand: 'Flycam',
    price: 20490000,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviews: 5,
    description: 'Flycam DJI Flip kèm tay điều khiển tiêu chuẩn RC-N3.',
    specs: {
      'Camera': '12MP 4K Video',
    }
  },
  {
    id: 'flycam-dji-flip-rc2',
    name: 'DJI Flip (DJI RC2) | Chính Hãng',
    brand: 'Flycam',
    price: 34990000,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 7,
    description: 'DJI Flip đi kèm tay cầm DJI RC 2 điều khiển mượt mà, màn hình hiển thị trực tiếp.',
    specs: {
      'Tay điều khiển': 'DJI RC 2 (Màn hình 5.5 inch)',
    }
  },
  {
    id: 'flycam-dji-flip-fmc',
    name: 'DJI Flip Fly More Combo | Chính Hãng',
    brand: 'Flycam',
    price: 39990000,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 9,
    badge: 'Bán chạy',
    description: 'Trọn bộ combo 3 pin, đốc sạc 3 chiều và túi đựng du lịch cao cấp cho DJI Flip.',
    specs: {
      'Phụ kiện': '3 Pin + Đốc sạc + Túi đựng',
    }
  },
  {
    id: 'flycam-dji-mavic-4-combo',
    name: 'DJI Mavic 4 Pro 512GB Creator Combo | Chính Hãng',
    brand: 'Flycam',
    price: 169990000,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviews: 2,
    badge: 'Creator',
    description: 'Flagship quay phim từ trên không đỉnh cao của DJI với ổ cứng SSD 512GB tích hợp và cụm 3 camera Hasselblad huyền thoại.',
    specs: {
      'Camera': 'Triple Hasselblad Camera',
      'Bộ nhớ': '512GB SSD tích hợp',
      'Quay video': '5.1K Apple ProRes',
    }
  },
  {
    id: 'flycam-dji-mavic-4-rc2',
    name: 'DJI Mavic 4 Pro Fly More Combo (DJI RC 2) | Chính Hãng',
    brand: 'Flycam',
    price: 139990000,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 6,
    description: 'Mavic 4 Pro bản Fly More Combo kèm 3 pin bay thông minh và tay cầm màn hình cảm ứng RC 2.',
    specs: {
      'Camera': '3 camera zoom quang học',
      'Tránh vật cản': 'Cảm biến đa hướng omni-directional',
    }
  },
  {
    id: 'flycam-dji-mini-3-rc',
    name: 'DJI Mini 3 (DJI RC) | Chính Hãng',
    brand: 'Flycam',
    price: 34990000,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 25,
    description: 'Flycam siêu nhẹ dưới 249g đi kèm tay cầm RC giúp bạn quay video khung hình dọc 4K HDR sáng tạo.',
    specs: {
      'Trọng lượng': '249g',
      'Quay video dọc': 'True Vertical Shooting 4K',
    }
  },
  {
    id: 'flycam-dji-mini-3-fmc',
    name: 'DJI Mini 3 Fly More Combo (DJI RC) | Chính Hãng',
    brand: 'Flycam',
    price: 49990000,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 31,
    description: 'Bản combo tăng cường thời gian bay cho DJI Mini 3 với 3 pin dung lượng lớn.',
    specs: {
      'Thời gian bay': 'Tối đa 38 phút / pin',
    }
  },
  {
    id: 'flycam-dji-mini-4-rcn2',
    name: 'DJI Mini 4 Pro (RC-N2) | Chính Hãng',
    brand: 'Flycam',
    price: 29990000,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 14,
    description: 'Flycam mini cao cấp nhất của DJI sở hữu cảm biến tránh vật cản đa hướng thông minh.',
    specs: {
      'Trọng lượng': '249g',
      'Cảm biến vật cản': 'Đa hướng ActiveTrack 360',
    }
  },
  {
    id: 'flycam-dji-mini-4-rc2',
    name: 'DJI Mini 4 Pro (RC2) | Chính Hãng',
    brand: 'Flycam',
    price: 39990000,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 20,
    description: 'Mini 4 Pro kèm tay cầm thông minh DJI RC 2, truyền sóng O4 mượt mà không độ trễ.',
    specs: {
      'Tay cầm': 'DJI RC 2',
      'Quay video': '4K/60fps HDR & 4K/100fps Slow Motion',
    }
  },

  // ACTION CAMERA (brand: 'Action Camera')
  {
    id: 'action-camera-gopro-13',
    name: 'Máy quay hành trình GoPro Hero 13 Black | Chính Hãng',
    brand: 'Action Camera',
    price: 11990000,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 29,
    description: 'Dòng camera hành động mới với cảm biến góc siêu rộng và chống rung HyperSmooth 6.0 xuất sắc.',
    specs: {
      'Độ phân giải': '5.3K Video',
      'Chống rung': 'HyperSmooth 6.0',
    }
  },
  {
    id: 'action-camera-dji-action-5',
    name: 'Máy quay hành động DJI Osmo Action 5 Pro | Chính Hãng',
    brand: 'Action Camera',
    price: 10490000,
    image: 'https://images.unsplash.com/photo-1616448244355-513501f0ae1d?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 18,
    description: 'Camera hành động chuyên nghiệp của DJI với cảm biến 1/1.3-inch thế hệ mới cho dải nhạy sáng vượt trội.',
    specs: {
      'Cảm biến': '1/1.3-inch CMOS',
      'Màn hình': 'Dual OLED Touchscreens',
    }
  },

  // GIMBAL (brand: 'Gimbal')
  {
    id: 'gimbal-dji-rs4',
    name: 'Thiết bị chống rung DJI RS 4 | Chính Hãng',
    brand: 'Gimbal',
    price: 12990000,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 11,
    description: 'Gimbal máy ảnh chuyên nghiệp của DJI hỗ trợ quay dọc native thế hệ thứ 2.',
    specs: {
      'Tải trọng': 'Tối đa 3kg',
      'Trục khóa': 'Tự động khóa trục thế hệ mới',
    }
  },
  {
    id: 'gimbal-dji-osmo-6',
    name: 'Tay cầm chống rung DJI Osmo Mobile 6 | Chính Hãng',
    brand: 'Gimbal',
    price: 3490000,
    image: 'https://images.unsplash.com/photo-1597200381847-30ec200eeb9b?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 84,
    description: 'Gimbal điện thoại cao cấp, theo dõi thông minh ActiveTrack 6.0 và gậy kéo dài tích hợp.',
    specs: {
      'Tính năng': 'ActiveTrack 6.0, Quick Launch',
    }
  },

  // MICRO (brand: 'Micro')
  {
    id: 'micro-dji-mic-2',
    name: 'Bộ thu âm không dây DJI Mic 2 (2 TX + 1 RX) | Chính Hãng',
    brand: 'Micro',
    price: 8490000,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 20,
    description: 'Microphone không dây chất lượng ghi âm 32-bit float thông minh, chống ồn thông minh thích hợp làm vlog, phỏng vấn.',
    specs: {
      'Ghi âm': '32-bit Float Internal Recording',
      'Khoảng cách': 'Tối đa 250m',
    }
  },
  {
    id: 'micro-rode-wireless-pro',
    name: 'Micro không dây Rode Wireless PRO | Chính Hãng',
    brand: 'Micro',
    price: 11500000,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviews: 14,
    description: 'Hệ thống micro không dây cao cấp nhất của Rode, tích hợp mã thời gian Timecode chuyên nghiệp.',
    specs: {
      'Tần số': '2.4GHz series IV',
      'Timecode': 'Đồng bộ hóa thời gian chính xác',
    }
  },

  // PHỤ KIỆN (brand: 'Phụ kiện')
  {
    id: 'acc-tripod-peak',
    name: 'Chân máy ảnh Peak Design Travel Tripod Carbon | Chính Hãng',
    brand: 'Phụ kiện',
    price: 18990000,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 9,
    description: 'Chân máy ảnh du lịch bằng sợi carbon siêu nhẹ, gấp gọn tối đa của Peak Design nổi tiếng.',
    specs: {
      'Chất liệu': 'Carbon Fiber',
      'Trọng lượng': '1.29kg',
    }
  },

  // SKIN (brand: 'Skin')
  {
    id: 'skin-sony-a7iv',
    name: 'Skin dán bảo vệ 3M Matrix cho Sony A7 IV',
    brand: 'Skin',
    price: 350000,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 34,
    description: 'Skin dán chất liệu 3M cao cấp cắt CNC chính xác bảo vệ thân máy Sony Alpha A7 IV chống trầy xước.',
    specs: {
      'Chất liệu': 'Decal 3M cao cấp nhập khẩu',
    }
  }
];
