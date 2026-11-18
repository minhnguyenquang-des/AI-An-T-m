import { FaqItem, HospitalFacility, InjuryGuide, VideoModule } from "../types/triage";

export const HERO_FIRSTAID_IMAGE = "/src/assets/images/hero_firstaid_kit_1794965333707.jpg";
export const IMG_BURN_COOLING = "/src/assets/images/guide_burn_cooling_1794965334456.jpg";
export const IMG_BLEEDING_PRESSURE = "/src/assets/images/guide_bleeding_pressure_1794965335390.jpg";
export const IMG_EYE_SHIELD = "/src/assets/images/guide_eye_shield_1794965335175.jpg";
export const IMG_RECOVERY_POSITION = "/src/assets/images/guide_recovery_position_1794965336453.jpg";

export const QUICK_PROMPTS = [
  {
    id: "burn",
    vi: "Bỏng do pháo",
    en: "Firework burn",
    fullPromptVi: "Người bị bỏng do tia lửa pháo hoa vào tay, da đỏ rát và nổi phồng rộp. Cần sơ cứu ngay như thế nào?",
    fullPromptEn: "Someone got a firework spark burn on their hand with redness and blisters. How should I perform immediate first aid?",
  },
  {
    id: "bleeding",
    vi: "Vết thương hở / chảy máu",
    en: "Open wound / bleeding",
    fullPromptVi: "Pháo nổ gây vết thương hở đang chảy máu ở bàn tay hoặc cánh tay. Tôi cần cầm máu và xử lý thế nào?",
    fullPromptEn: "A firework blast caused an open bleeding wound on a hand or arm. How do I control the bleeding safely?",
  },
  {
    id: "eye",
    vi: "Chấn thương mắt",
    en: "Eye injury",
    fullPromptVi: "Bụi pháo và tia lửa bắn vào mắt khiến nạn nhân đau rát, chảy nước mắt và nhìn mờ. Phải làm gì ngay?",
    fullPromptEn: "Firework sparks and debris hit someone's eye causing pain, tearing, and blurred vision. What should we do immediately?",
  },
  {
    id: "shock",
    vi: "Sốc / bất tỉnh",
    en: "Shock / unconscious",
    fullPromptVi: "Nạn nhân bị choáng, mặt tái nhợt hoặc bất tỉnh sau tiếng nổ pháo lớn. Tôi cần kiểm tra và sơ cứu ra sao?",
    fullPromptEn: "A person is dizzy, pale, or unconscious after a loud firework blast. How should I check and assist them?",
  },
  {
    id: "smoke",
    vi: "Ngộ độc khói / bụi",
    en: "Smoke / fume inhalation",
    fullPromptVi: "Hít phải nhiều khói pháo gây ho sặc sụa, tức ngực và khó thở. Cần xử lý ban đầu thế nào?",
    fullPromptEn: "Someone inhaled heavy firework smoke and is coughing with chest tightness and shortness of breath. What is the first aid?",
  },
];

export const INJURY_GUIDES: InjuryGuide[] = [
  {
    id: "burn",
    category: "burn",
    severityDefault: "YELLOW",
    title: {
      vi: "Bỏng nhiệt & bỏng hóa chất do pháo",
      en: "Thermal & Chemical Firework Burns",
    },
    shortSummary: {
      vi: "Làm mát ngay bằng nước sạch mát 15–20 phút, che phủ vô khuẩn, không bôi mẹo dân gian.",
      en: "Cool immediately under clean cool running water for 15–20 minutes and cover loosely.",
    },
    firstAidSteps: {
      vi: [
        "Đưa nạn nhân ra khỏi nguồn nhiệt/khói pháo đến nơi an toàn.",
        "Xả nước sạch mát (không dùng nước đá) nhẹ nhàng lên vùng bỏng liên tục 15–20 phút.",
        "Tháo nhẹ nhẫn, đồng hồ, quần áo không dính chặt vào da trước khi vùng bỏng sưng nề.",
        "Che phủ vết bỏng bằng gạc vô khuẩn không dính hoặc màng bọc thực phẩm sạch.",
        "Giữ ấm phần cơ thể còn lại và đưa đến cơ sở y tế nếu bỏng rộng, sâu hoặc ở vùng nhạy cảm.",
      ],
      en: [
        "Move the person away from heat, sparks, and smoke to a safe area.",
        "Run cool (not ice-cold) clean tap water gently over the burn for 15–20 minutes.",
        "Gently remove rings, watches, or loose clothing before swelling develops, unless stuck to skin.",
        "Cover loosely with sterile non-stick gauze or clean plastic wrap.",
        "Keep the person warm and seek urgent medical evaluation if deep, large, or on critical areas.",
      ],
    },
    doNotDo: {
      vi: [
        "Tuyệt đối không bôi kem đánh răng, nước mắm, dầu ăn, mỡ trăn, lá cây hoặc thuốc không rõ nguồn gốc.",
        "Không chườm trực tiếp đá lạnh vì gây co mạch và tổn thương mô nặng hơn.",
        "Không tự ý chọc vỡ các bọng nước bỏng.",
        "Không giật mạnh quần áo đang dính chặt vào vết bỏng.",
      ],
      en: [
        "Never apply toothpaste, butter, oils, soy/fish sauce, or herbal pastes.",
        "Never apply ice directly to the burn.",
        "Do not pop or peel burn blisters.",
        "Do not pull off clothing stuck to burned skin.",
      ],
    },
    hospitalRedFlags: {
      vi: [
        "Bỏng ở mặt, mắt, cổ, bàn tay, bàn chân, khớp lớn hoặc vùng sinh dục.",
        "Vết bỏng lớn hơn lòng bàn tay nạn nhân hoặc da cháy sém, trắng bệch, mất cảm giác.",
        "Nạn nhân là trẻ em, người cao tuổi hoặc có dấu hiệu hít khói nóng.",
      ],
      en: [
        "Burns on the face, eyes, neck, hands, feet, major joints, or groin.",
        "Burn area larger than the victim's palm, or charred/white/numb skin.",
        "Victim is a child, elderly, or has inhaled hot smoke.",
      ],
    },
    aiPrefillPrompt: {
      vi: "Tôi cần hướng dẫn sơ cứu bỏng do pháo hoa: nên làm mát bao lâu và dấu hiệu nào cần nhập viện?",
      en: "I need firework burn first-aid steps: how long to cool and when to go to the hospital?",
    },
    source: "Hội Chữ thập đỏ & Bộ Y tế",
  },
  {
    id: "bleeding",
    category: "bleeding",
    severityDefault: "RED",
    title: {
      vi: "Vết thương hở & chảy máu do pháo nổ",
      en: "Open Wounds & Blast Hemorrhage",
    },
    shortSummary: {
      vi: "Ép trực tiếp bằng gạc sạch để cầm máu, giữ nguyên dị vật lớn, gọi 115 nếu máu phun mạnh.",
      en: "Apply firm direct pressure with sterile gauze, keep large debris intact, call 115 for severe bleeding.",
    },
    firstAidSteps: {
      vi: [
        "Đeo găng tay y tế hoặc dùng túi nilon sạch bảo vệ tay trước khi chạm vào máu.",
        "Đặt gạc vô khuẩn hoặc vải sạch lên vết thương và ấn giữ chắc liên tục ít nhất 10 phút.",
        "Nếu máu thấm qua lớp gạc đầu tiên, đặt thêm lớp mới đè lên trên, không gỡ lớp cũ ra.",
        "Kê cao chi bị thương nếu không nghi ngờ gãy xương.",
        "Nếu có mảnh pháo găm sâu, không rút ra mà chèn gạc cố định xung quanh rồi gọi 115.",
      ],
      en: [
        "Wear medical gloves or use a clean barrier before touching blood.",
        "Place sterile gauze or clean cloth over the wound and apply firm continuous pressure for at least 10 minutes.",
        "If blood soaks through, add another pad on top without removing the first pad.",
        "Elevate the injured limb above heart level if no fracture is suspected.",
        "If firework debris is embedded, do not pull it out; pad around it and call 115.",
      ],
    },
    doNotDo: {
      vi: [
        "Không tự ý rút mảnh pháo, mảnh nhựa/kim loại găm sâu ra khỏi vết thương.",
        "Không rắc thuốc bột, lá thuốc, tro bếp hoặc cồn trực tiếp vào vết thương sâu.",
        "Không tự ý dùng garo siết chặt bừa bãi nếu không được đào tạo và máu không phải phun thành tia đe dọa tính mạng.",
      ],
      en: [
        "Never pull out deeply embedded fragments or debris.",
        "Never sprinkle powders, tobacco, herbs, or pour harsh alcohol into deep wounds.",
        "Do not improvise tight tourniquets unless trained and bleeding is life-threatening arterial hemorrhage.",
      ],
    },
    hospitalRedFlags: {
      vi: [
        "Máu chảy ồ ạt, phun thành tia hoặc không cầm sau 10 phút ép chặt.",
        "Dập nát bàn tay/ngón tay, đứt lìa chi hoặc lộ xương/gân.",
        "Nạn nhân da xanh tái, vã mồ hôi lạnh, thở nhanh hoặc lơ mơ.",
      ],
      en: [
        "Spurting or uncontrolled bleeding that does not slow after 10 minutes of firm pressure.",
        "Crushed hand/fingers, partial or complete amputation, or exposed tendon/bone.",
        "Signs of shock: pale clammy skin, rapid breathing, dizziness, or confusion.",
      ],
    },
    aiPrefillPrompt: {
      vi: "Pháo nổ gây vết thương hở chảy máu nhiều ở tay, tôi nên cầm máu và bảo quản phần tổn thương thế nào?",
      en: "A firework blast caused heavy bleeding on a hand. How should I control bleeding and protect the injury?",
    },
    source: "WHO Trauma Care & Bộ Y tế",
  },
  {
    id: "eye",
    category: "eye",
    severityDefault: "RED",
    title: {
      vi: "Chấn thương mắt do tia lửa & bụi pháo",
      en: "Ocular Trauma & Spark Eye Injury",
    },
    shortSummary: {
      vi: "Che chắn bảo vệ bằng cốc giấy cứng, tuyệt đối không dụi mắt hay tự gắp dị vật, đi khám mắt khẩn.",
      en: "Shield eye gently with a rigid cup, never rub or remove embedded particles, seek immediate eye ER care.",
    },
    firstAidSteps: {
      vi: [
        "Giữ nạn nhân bình tĩnh, nhắc không nhắm chặt mắt quá mạnh và tuyệt đối không dụi mắt.",
        "Nếu nghi hóa chất/bụi mịn (không rách nhãn cầu): rửa nhẹ bằng nước muối sinh lý 0,9% hoặc nước sạch từ khóe mắt trong ra ngoài trong 15 phút.",
        "Nếu nghi vật sắc nhọn/tia nổ đập trực tiếp vào mắt: KHÔNG rửa hay ấn lên mắt.",
        "Úp nhẹ đáy cốc giấy hoặc tấm chắn cứng che quanh hốc mắt rồi dán băng keo cố định lên trán và má.",
        "Đưa ngay đến chuyên khoa Mắt hoặc bệnh viện gần nhất; gọi 115 nếu kèm chấn thương vùng mặt.",
      ],
      en: [
        "Keep the person calm and instruct them NOT to rub or squeeze the injured eye.",
        "Only if fine dust/chemical splash with intact eyeball: gently flush with sterile saline or clean water from inner corner outward for 15 minutes.",
        "If blunt blast or sharp particle hit the eye: DO NOT rinse or apply pressure.",
        "Tape a rigid paper cup shield lightly over the orbital bone without touching the eyelid.",
        "Transport immediately to an emergency ophthalmology center or call 115.",
      ],
    },
    doNotDo: {
      vi: [
        "Tuyệt đối không dụi mắt, bóp mắt hoặc băng ép chặt lên nhãn cầu.",
        "Không dùng nhíp, tăm bông hoặc góc khăn để tự lấy dị vật.",
        "Không tự nhỏ thuốc nhỏ mắt chứa corticoid hay thuốc giảm đau mắt.",
      ],
      en: [
        "Never rub, press, or apply a tight bandage directly onto the eyeball.",
        "Never use tweezers, cotton swabs, or cloth corners to extract debris.",
        "Do not instill steroid or numbing eye drops without a doctor.",
      ],
    },
    hospitalRedFlags: {
      vi: [
        "Mọi trường hợp tia lửa/mảnh pháo bắn trực tiếp vào mắt đều cần khám bác sĩ chuyên khoa mắt ngay.",
        "Nhìn mờ, nhìn đôi, đau nhức dữ dội, chảy máu trong mắt hoặc đồng tử biến dạng.",
      ],
      en: [
        "ALL direct firework eye injuries require urgent specialist ophthalmology assessment.",
        "Blurred/double vision, severe pain, blood inside the eye, or irregular pupil shape.",
      ],
    },
    aiPrefillPrompt: {
      vi: "Tia lửa pháo hoa bay vào mắt gây cộm và mờ mắt, cần xử lý ban đầu thế nào để không làm hỏng giác mạc?",
      en: "Firework sparks entered an eye causing irritation and blurriness. How do I protect the cornea before hospital arrival?",
    },
    source: "Bệnh viện Mắt TW & AAO",
  },
  {
    id: "ear",
    category: "ear",
    severityDefault: "YELLOW",
    title: {
      vi: "Chấn thương tai & giảm thính lực do tiếng nổ",
      en: "Acoustic Trauma & Blast Ear Injury",
    },
    shortSummary: {
      vi: "Giữ tai khô ráo, không nhỏ thuốc hay ngoáy tai khi có ù tai, đau nhói hoặc chảy dịch/máu.",
      en: "Keep ear dry, never insert drops or swabs if experiencing ringing, ear pain, or fluid/blood.",
    },
    firstAidSteps: {
      vi: [
        "Đưa nạn nhân ra khỏi khu vực có tiếng ồn lớn đến nơi yên tĩnh.",
        "Nếu thấy máu hoặc dịch chảy từ ống tai: đặt nhẹ gạc sạch bên ngoài vành tai, không nhét sâu vào lỗ tai.",
        "Giữ đầu hơi nghiêng về bên tai bị chảy dịch nếu nạn nhân tỉnh táo và không chấn thương cổ.",
        "Đặt lịch hoặc đưa đi khám chuyên khoa Tai Mũi Họng trong 24 giờ để kiểm tra màng nhĩ và thính lực.",
      ],
      en: [
        "Move the person to a quiet area away from further loud blasts.",
        "If fluid or blood drains from the ear canal, place clean gauze loosely over the outer ear—do not plug the canal.",
        "Allow drainage while keeping the person still.",
        "Seek ENT evaluation within 24 hours (immediately if bleeding or dizziness occurs).",
      ],
    },
    doNotDo: {
      vi: [
        "Không tự nhỏ oxy già, cồn, dầu hoặc bất kỳ thuốc nhỏ tai nào khi chưa biết màng nhĩ có thủng không.",
        "Không dùng tăm bông ngoáy sâu vào ống tai.",
        "Không bịt kín ống tai hoặc xì mũi mạnh.",
      ],
      en: [
        "Do not instill ear drops, peroxide, or oils when eardrum perforation is possible.",
        "Do not insert cotton swabs into the ear canal.",
        "Do not plug the ear canal tightly or blow nose forcefully.",
      ],
    },
    hospitalRedFlags: {
      vi: [
        "Chảy máu hoặc chảy dịch trong từ tai sau tiếng nổ.",
        "Chóng mặt dữ dội, mất thăng bằng, buồn nôn hoặc điếc đột ngột.",
        "Ù tai và đau nhói tai kéo dài quá vài giờ.",
      ],
      en: [
        "Blood or clear fluid leaking from the ear canal after an explosion.",
        "Severe vertigo, loss of balance, vomiting, or sudden hearing loss.",
        "Persistent ringing (tinnitus) or sharp ear pain.",
      ],
    },
    aiPrefillPrompt: {
      vi: "Sau tiếng pháo nổ gần, nạn nhân bị ù tai và nghe kém một bên tai. Cần lưu ý gì và khi nào đi khám?",
      en: "After a close firework explosion, someone has tinnitus and muffled hearing in one ear. What precautions are needed?",
    },
    source: "Hội Tai Mũi Họng & WHO",
  },
  {
    id: "fracture",
    category: "fracture",
    severityDefault: "RED",
    title: {
      vi: "Gãy xương & chấn thương lực nổ",
      en: "Fractures & Blast Impact Trauma",
    },
    shortSummary: {
      vi: "Bất động vùng nghi gãy tại chỗ, không tự nắn chỉnh xương, chèn lạnh gián tiếp và gọi 115.",
      en: "Immobilize in place, never attempt to realign bones, apply wrapped cold pack, and call 115.",
    },
    firstAidSteps: {
      vi: [
        "Giữ nạn nhân nằm yên, không di chuyển nếu nghi ngờ chấn thương cột sống, cổ hoặc xương chậu.",
        "Bất động chi nghi gãy bằng nẹp gỗ/bìa cứng có đệm vải mềm ở hai bên khớp trên và dưới ổ gãy.",
        "Nếu là gãy xương hở (lộ đầu xương): phủ nhẹ bằng gạc vô khuẩn ẩm sạch, không đẩy đầu xương vào trong.",
        "Chườm lạnh qua khăn vải (không đặt đá trực tiếp) quanh vùng sưng nề trong khi chờ cấp cứu.",
      ],
      en: [
        "Keep the person still; do not move them if head, neck, spine, or pelvic injury is suspected.",
        "Immobilize the suspected fracture above and below the joint using padded rigid splints.",
        "For open fractures, cover exposed bone gently with sterile moist gauze without pushing it back.",
        "Apply an ice pack wrapped in cloth near swelling while awaiting emergency medical services.",
      ],
    },
    doNotDo: {
      vi: [
        "Không tự ý kéo, nắn, bẻ khớp hoặc xoa bóp dầu nóng lên vùng nghi gãy xương.",
        "Không cho nạn nhân ăn uống đề phòng cần phẫu thuật cấp cứu.",
        "Không di chuyển người nghi chấn thương cột sống khi chưa có đội cấp cứu chuyên nghiệp.",
      ],
      en: [
        "Never attempt to straighten, pull, or massage a deformed limb.",
        "Do not give food or drink in case emergency surgery is required.",
        "Never move someone with suspected spinal trauma unless in immediate fire/explosion danger.",
      ],
    },
    hospitalRedFlags: {
      vi: [
        "Chi biến dạng rõ, lộ xương, tê bì hoặc đầu ngón tay/chân tím tái lạnh.",
        "Nghi chấn thương đầu, cổ, ngực hoặc bụng sau vụ nổ.",
      ],
      en: [
        "Visible limb deformity, open bone exposure, numbness, or cold/blue fingers or toes.",
        "Any suspected head, neck, chest, or abdominal blast trauma.",
      ],
    },
    aiPrefillPrompt: {
      vi: "Lực nổ pháo tự chế làm bàn tay hoặc cẳng tay sưng to, biến dạng và rất đau. Nên cố định thế nào trước khi đến viện?",
      en: "A firework blast caused severe swelling and deformity in a forearm. How should we splint it before hospital transport?",
    },
    source: "Bộ Y tế & IFRC First Aid",
  },
  {
    id: "shock",
    category: "shock",
    severityDefault: "RED",
    title: {
      vi: "Sốc, choáng ngất & bất tỉnh",
      en: "Shock, Fainting & Unconsciousness",
    },
    shortSummary: {
      vi: "Gọi 115 ngay, kiểm tra nhịp thở; nếu còn thở đặt tư thế nằm nghiêng an toàn, giữ ấm cơ thể.",
      en: "Call 115 immediately, check breathing; if breathing normally place in recovery position and keep warm.",
    },
    firstAidSteps: {
      vi: [
        "Kiểm tra hiện trường an toàn rồi lay nhẹ vai và gọi to xem nạn nhân có phản ứng không.",
        "Nhờ người xung quanh gọi cấp cứu 115 ngay lập tức và báo rõ tình trạng bất tỉnh.",
        "Kiểm tra nhịp thở trong 10 giây (nhìn lồng ngực di động, nghe hơi thở).",
        "Nếu bất tỉnh nhưng vẫn thở bình thường và không nghi chấn thương cột sống: đặt nạn nhân ở tư thế nằm nghiêng an toàn.",
        "Nếu nạn nhân tỉnh nhưng có dấu hiệu sốc (mặt tái, lạnh run): cho nằm ngửa, kê cao chân khoảng 20–30 cm nếu không chấn thương chân/cột sống và đắp chăn mỏng giữ ấm.",
      ],
      en: [
        "Ensure the scene is safe, then tap shoulders gently and shout to check responsiveness.",
        "Have someone call 115 immediately and stay on speaker.",
        "Check for normal breathing for up to 10 seconds.",
        "If unconscious but breathing normally (and no spinal injury suspected), place in the lateral recovery position.",
        "If conscious with shock signs (pale, clammy), lay flat, elevate legs 20–30 cm if safe, and cover lightly to retain warmth.",
      ],
    },
    doNotDo: {
      vi: [
        "Không đổ nước, sữa, nước đường hoặc thuốc vào miệng người đang bất tỉnh hoặc lơ mơ.",
        "Không tát vào mặt, giật tóc hoặc bế xốc nạn nhân chạy lòng vòng.",
        "Không kê gối cao dưới đầu làm gập đường thở.",
      ],
      en: [
        "Never pour water, sugar drinks, or medicine into the mouth of an unconscious or drowsy person.",
        "Never slap, shake vigorously, or carry the victim upright.",
        "Do not place a high pillow under the head that flexes the airway.",
      ],
    },
    hospitalRedFlags: {
      vi: [
        "Mọi trường hợp bất tỉnh, ngưng thở, co giật hoặc lơ mơ đều là tình huống ĐỎ — gọi 115 ngay.",
        "Nhịp tim nhanh yếu, da tái lạnh, thở hổn hển hoặc tụt huyết áp.",
      ],
      en: [
        "Any loss of consciousness, absent/abnormal breathing, or seizure is an immediate RED emergency — call 115.",
        "Weak rapid pulse, cold clammy skin, or gasping breaths.",
      ],
    },
    aiPrefillPrompt: {
      vi: "Nạn nhân bị bất tỉnh hoặc choáng váng sau tai nạn pháo, hiện vẫn còn thở. Tư thế nằm và các bước xử lý đúng là gì?",
      en: "Someone fainted after a firework incident and is still breathing. What is the safest position and immediate care?",
    },
    source: "Hội Chữ thập đỏ & AHA/WHO",
  },
  {
    id: "smoke",
    category: "smoke",
    severityDefault: "YELLOW",
    title: {
      vi: "Ngộ độc khói, khí độc & bụi pháo",
      en: "Smoke, Toxic Fume & Dust Inhalation",
    },
    shortSummary: {
      vi: "Đưa ngay ra nơi thoáng khí, nới lỏng cổ áo, ngồi thẳng dễ thở; gọi 115 nếu khò khè hoặc tím tái.",
      en: "Move immediately to fresh air, loosen tight collars, sit upright; call 115 if wheezing or bluish lips.",
    },
    firstAidSteps: {
      vi: [
        "Đưa nạn nhân rời khỏi đám khói đến nơi thoáng gió, không khí trong lành ngay.",
        "Nới lỏng cổ áo, cà vạt, thắt lưng; để nạn nhân ngồi thẳng hơi nghiêng người về trước cho dễ thở.",
        "Nếu người bệnh có tiền sử hen suyễn và mang theo bình xịt cắt cơn theo đơn bác sĩ, hỗ trợ họ sử dụng đúng cách.",
        "Súc miệng bằng nước sạch nhẹ nhàng (nhổ ra, không nuốt) nếu họng rát bụi khói.",
        "Theo dõi nhịp thở liên tục trong 24 giờ vì phù nề đường thở do khí nóng có thể xuất hiện muộn.",
      ],
      en: [
        "Move the person immediately to open, fresh air away from firework smoke.",
        "Loosen tight clothing around the neck and chest; assist them into an upright seated position.",
        "If they carry a prescribed asthma rescue inhaler, assist them in using it.",
        "Rinse mouth gently with clean water (spit out) if throat feels coated with soot.",
        "Monitor breathing closely, as airway swelling from hot fumes can worsen hours later.",
      ],
    },
    doNotDo: {
      vi: [
        "Không để nạn nhân nằm ngửa bẹp nếu đang khó thở.",
        "Không xông hơi nóng hoặc đốt tinh dầu trong phòng kín.",
        "Không chủ quan bỏ qua nếu thấy muội đen quanh mũi, miệng hoặc khàn tiếng.",
      ],
      en: [
        "Do not force someone having trouble breathing to lie flat on their back.",
        "Do not use steam inhalation or strong essential oils in closed rooms.",
        "Do not ignore soot around the nose/mouth or sudden hoarseness.",
      ],
    },
    hospitalRedFlags: {
      vi: [
        "Khó thở, thở rít, khàn tiếng đột ngột, ho ra đờm đen hoặc môi đầu ngón tay tím tái.",
        "Đau tức ngực, chóng mặt, buồn nôn hoặc lú lẫn (nghi ngộ độc khí).",
      ],
      en: [
        "Difficulty breathing, wheezing/stridor, hoarse voice, black soot sputum, or bluish lips/nails.",
        "Chest pain, dizziness, vomiting, or confusion.",
      ],
    },
    aiPrefillPrompt: {
      vi: "Trẻ em hoặc người lớn tuổi hít phải nhiều khói pháo đang ho dữ dội và tức ngực. Khi nào phải đưa đi cấp cứu?",
      en: "A child or older adult inhaled heavy firework smoke and is coughing with chest tightness. When is emergency care needed?",
    },
    source: "Bộ Y tế & WHO Airway Care",
  },
];

export const VIDEO_MODULES: VideoModule[] = [
  {
    id: "vid-burn",
    durationSec: 45,
    title: {
      vi: "Sơ cứu bỏng pháo trong 3 bước chuẩn",
      en: "3-Step Firework Burn Cooling Protocol",
    },
    subtitle: {
      vi: "Video hướng dẫn tương tác · Có phụ đề song ngữ & đồng hồ đếm 20 phút",
      en: "Interactive sequence · Bilingual captions & 20-min cooling timer",
    },
    thumbnailUrl: IMG_BURN_COOLING,
    hasBurnTimer: true,
    slides: [
      {
        startSec: 0,
        endSec: 15,
        actionTag: { vi: "Bước 01 · Tách nguồn nhiệt", en: "Step 01 · Ensure Safety" },
        instructionTitle: {
          vi: "Đưa nạn nhân ra xa tia lửa & tháo vật dụng chật",
          en: "Move away from sparks & remove tight items",
        },
        caption: {
          vi: "Đảm bảo khu vực an toàn khỏi pháo nổ tiếp. Nhẹ nhàng tháo nhẫn, đồng hồ trước khi vùng da sưng nề, không giật vải đang dính chặt.",
          en: "Move to safety. Gently remove rings or watches before swelling begins; never peel clothing stuck to burned skin.",
        },
        imageUrl: HERO_FIRSTAID_IMAGE,
      },
      {
        startSec: 15,
        endSec: 32,
        actionTag: { vi: "Bước 02 · Làm mát 15–20 phút", en: "Step 02 · Cool 15–20 Mins" },
        instructionTitle: {
          vi: "Xả nước sạch mát liên tục dưới vòi nhẹ",
          en: "Cool under gentle running tap water",
        },
        caption: {
          vi: "Mở vòi nước sạch mát (không dùng nước đá) chảy nhẹ qua vết bỏng trong 15–20 phút để hạ nhiệt sâu và giảm đau rát.",
          en: "Run cool (never icy) clean tap water continuously over the burn for 15–20 minutes to stop thermal damage.",
        },
        imageUrl: IMG_BURN_COOLING,
      },
      {
        startSec: 32,
        endSec: 45,
        actionTag: { vi: "Bước 03 · Che phủ vô khuẩn", en: "Step 03 · Cover Sterilely" },
        instructionTitle: {
          vi: "Che phủ gạc sạch không dính, không bôi thuốc dân gian",
          en: "Cover loosely with non-stick sterile gauze",
        },
        caption: {
          vi: "Đặt nhẹ gạc vô khuẩn hoặc màng bọc sạch. Tuyệt đối không bôi kem đánh răng, nước mắm hay dầu mỡ. Đến viện nếu bỏng rộng/sâu.",
          en: "Cover loosely with sterile gauze. Never apply toothpaste, fish sauce, or oil. Seek care for deep or hand/face burns.",
        },
        imageUrl: HERO_FIRSTAID_IMAGE,
      },
    ],
  },
  {
    id: "vid-bleeding",
    durationSec: 40,
    title: {
      vi: "Kỹ thuật ép trực tiếp cầm máu vết thương hở",
      en: "Direct Pressure Hemorrhage Control",
    },
    subtitle: {
      vi: "Video hướng dẫn tương tác · Chống sốc mất máu trước khi xe 115 tới",
      en: "Interactive sequence · Bleeding control prior to EMS arrival",
    },
    thumbnailUrl: IMG_BLEEDING_PRESSURE,
    slides: [
      {
        startSec: 0,
        endSec: 14,
        actionTag: { vi: "Bước 01 · Bảo vệ tay & đặt gạc", en: "Step 01 · Protect & Pad" },
        instructionTitle: {
          vi: "Đeo găng tay sạch, đặt gạc vô khuẩn lên miệng vết thương",
          en: "Wear clean gloves and place sterile gauze over wound",
        },
        caption: {
          vi: "Nếu có găng tay y tế trong hộp sơ cứu hãy đeo vào ngay. Đặt lớp gạc sạch phủ kín miệng vết thương đang chảy máu.",
          en: "Put on medical gloves if available. Place a thick pad of sterile gauze directly over the bleeding site.",
        },
        imageUrl: HERO_FIRSTAID_IMAGE,
      },
      {
        startSec: 14,
        endSec: 28,
        actionTag: { vi: "Bước 02 · Ép chắc liên tục", en: "Step 02 · Firm Pressure" },
        instructionTitle: {
          vi: "Dùng lực bàn tay ấn giữ chặt ít nhất 10 phút",
          en: "Press firmly and continuously for at least 10 minutes",
        },
        caption: {
          vi: "Ấn lực đều và giữ nguyên không nhấc gạc lên kiểm tra. Nếu máu thấm ướt, chồng thêm lớp gạc mới lên trên lớp cũ.",
          en: "Apply steady, firm downward pressure. Do not lift the pad to peek; layer new gauze on top if blood soaks through.",
        },
        imageUrl: IMG_BLEEDING_PRESSURE,
      },
      {
        startSec: 28,
        endSec: 40,
        actionTag: { vi: "Bước 03 · Chú ý dị vật & 115", en: "Step 03 · Debris & 115" },
        instructionTitle: {
          vi: "Không tự rút mảnh pháo găm sâu · Gọi 115 nếu máu phun mạnh",
          en: "Never pull embedded fragments · Call 115 if severe",
        },
        caption: {
          vi: "Nếu có dị vật pháo găm sâu, chèn gạc cố định quanh dị vật thay vì ấn lên nó và gọi ngay cấp cứu 115.",
          en: "If debris is embedded, pad around the object without pressing on it directly and call 115 immediately.",
        },
        imageUrl: IMG_BLEEDING_PRESSURE,
      },
    ],
  },
  {
    id: "vid-eye",
    durationSec: 36,
    title: {
      vi: "Bảo vệ mắt bị chấn thương do pháo",
      en: "Protecting an Injured Eye Safely",
    },
    subtitle: {
      vi: "Video hướng dẫn tương tác · Tránh nguy cơ tổn thương giác mạc thứ phát",
      en: "Interactive sequence · Preventing secondary corneal damage",
    },
    thumbnailUrl: IMG_EYE_SHIELD,
    slides: [
      {
        startSec: 0,
        endSec: 12,
        actionTag: { vi: "Bước 01 · Cấm dụi mắt", en: "Step 01 · Do Not Rub" },
        instructionTitle: {
          vi: "Giữ bình tĩnh, tuyệt đối không dụi hay chớp mạnh",
          en: "Keep calm and never rub or squeeze the eye",
        },
        caption: {
          vi: "Hành động dụi mắt khiến mảnh bụi pháo hoặc tia nổ cào rách giác mạc nghiêm trọng hơn. Giữ đầu nạn nhân ổn định.",
          en: "Rubbing grinds sharp firework grit into the cornea. Keep the person seated and calm.",
        },
        imageUrl: IMG_EYE_SHIELD,
      },
      {
        startSec: 12,
        endSec: 24,
        actionTag: { vi: "Bước 02 · Che chắn cứng", en: "Step 02 · Rigid Shield" },
        instructionTitle: {
          vi: "Dùng cốc giấy cứng úp quanh hốc mắt không chạm mí mắt",
          en: "Tape a rigid paper cup over orbital bone",
        },
        caption: {
          vi: "Cắt nhẹ đáy cốc giấy sạch nếu cần, đặt vành cốc tựa lên xương trán và xương gò má rồi dán băng keo nhẹ cố định.",
          en: "Rest the rim of a clean paper cup on the forehead and cheekbone so nothing touches the eyelid or eyeball.",
        },
        imageUrl: IMG_EYE_SHIELD,
      },
      {
        startSec: 24,
        endSec: 36,
        actionTag: { vi: "Bước 03 · Chuyên khoa Mắt", en: "Step 03 · Eye ER" },
        instructionTitle: {
          vi: "Đưa ngay đến bệnh viện có chuyên khoa Mắt",
          en: "Transport immediately to eye emergency care",
        },
        caption: {
          vi: "Không tự nhỏ thuốc, không tự gắp dị vật. Đưa thẳng tới Bệnh viện Mắt hoặc gọi 115 để được xử trí kịp thời.",
          en: "Do not apply unprescribed drops or remove particles. Proceed immediately to an ophthalmology ER.",
        },
        imageUrl: IMG_EYE_SHIELD,
      },
    ],
  },
  {
    id: "vid-recovery",
    durationSec: 42,
    title: {
      vi: "Tư thế nằm nghiêng an toàn cho người bất tỉnh còn thở",
      en: "Recovery Position for Breathing Unconscious Victims",
    },
    subtitle: {
      vi: "Video hướng dẫn tương tác · Giữ thông thoáng đường thở trong lúc chờ 115",
      en: "Interactive sequence · Maintaining airway patency until EMS arrives",
    },
    thumbnailUrl: IMG_RECOVERY_POSITION,
    slides: [
      {
        startSec: 0,
        endSec: 14,
        actionTag: { vi: "Bước 01 · Gọi 115 & kiểm tra thở", en: "Step 01 · Call 115 & Check" },
        instructionTitle: {
          vi: "Lay gọi kiểm tra phản ứng & quan sát nhịp thở 10 giây",
          en: "Check responsiveness and breathing for 10 seconds",
        },
        caption: {
          vi: "Đảm bảo hiện trường không còn pháo nổ. Gọi 115 ngay và kiểm tra xem lồng ngực nạn nhân có phập phồng đều đặn không.",
          en: "Verify scene safety, call 115, and watch the chest for normal regular breathing for up to 10 seconds.",
        },
        imageUrl: IMG_RECOVERY_POSITION,
      },
      {
        startSec: 14,
        endSec: 28,
        actionTag: { vi: "Bước 02 · Nghiêng an toàn", en: "Step 02 · Lateral Turn" },
        instructionTitle: {
          vi: "Xoay người nằm nghiêng, tay trên kê dưới má",
          en: "Roll smoothly onto side with hand supporting cheek",
        },
        caption: {
          vi: "Đặt cánh tay gần bạn vuông góc, gập gối chân đối diện rồi nhẹ nhàng xoay nạn nhân nằm nghiêng về phía bạn (nếu không nghi chấn thương cổ).",
          en: "If no spinal injury is suspected, gently roll the person onto their side with the upper hand under the cheek to tilt head back.",
        },
        imageUrl: IMG_RECOVERY_POSITION,
      },
      {
        startSec: 28,
        endSec: 42,
        actionTag: { vi: "Bước 03 · Theo dõi liên tục", en: "Step 03 · Monitor Airway" },
        instructionTitle: {
          vi: "Giữ đường thở mở, giữ ấm và tuyệt đối không cho uống nước",
          en: "Keep airway open, keep warm, give nothing by mouth",
        },
        caption: {
          vi: "Tư thế nghiêng giúp đờm dãi hoặc chất nôn thoát ra ngoài không gây sặc. Theo dõi nhịp thở đến khi nhân viên 115 có mặt.",
          en: "The lateral position keeps the airway clear of fluids. Monitor breathing continuously until emergency medics take over.",
        },
        imageUrl: IMG_RECOVERY_POSITION,
      },
    ],
  },
];

export const EMERGENCY_HOSPITALS: HospitalFacility[] = [
  {
    id: "le-huu-trac",
    name: {
      vi: "Bệnh viện Bỏng Quốc gia Lê Hữu Trác",
      en: "Le Huu Trac National Burn Hospital",
    },
    city: "Hà Nội",
    specialty: {
      vi: "Chuyên khoa Bỏng & Tạo hình",
      en: "National Burn & Reconstructive Center",
    },
    phone: "024 3688 3866",
    address: "263 Phùng Hưng, Hà Đông, Hà Nội",
    mapsQuery: "Bệnh viện Bỏng Quốc gia Lê Hữu Trác Hà Nội",
  },
  {
    id: "viet-duc",
    name: {
      vi: "Bệnh viện Hữu nghị Việt Đức",
      en: "Viet Duc University Hospital",
    },
    city: "Hà Nội",
    specialty: {
      vi: "Cấp cứu Ngoại khoa & Chấn thương chi",
      en: "Trauma & Emergency Surgery",
    },
    phone: "024 3825 3531",
    address: "40 Tràng Thi, Hoàn Kiếm, Hà Nội",
    mapsQuery: "Bệnh viện Hữu nghị Việt Đức Hà Nội",
  },
  {
    id: "mat-tw",
    name: {
      vi: "Bệnh viện Mắt Trung ương",
      en: "Vietnam National Eye Hospital",
    },
    city: "Hà Nội",
    specialty: {
      vi: "Cấp cứu Chấn thương Mắt",
      en: "Ophthalmology Trauma ER",
    },
    phone: "024 3826 3966",
    address: "85 Bà Triệu, Hai Bà Trưng, Hà Nội",
    mapsQuery: "Bệnh viện Mắt Trung ương Hà Nội",
  },
  {
    id: "cho-ray",
    name: {
      vi: "Bệnh viện Chợ Rẫy (Khoa Cấp cứu & Bỏng)",
      en: "Cho Ray Hospital (ER & Burn Unit)",
    },
    city: "TP. Hồ Chí Minh",
    specialty: {
      vi: "Đa khoa Hạng Đặc biệt · Bỏng & Chấn thương",
      en: "Tertiary Trauma, Burns & Toxicology",
    },
    phone: "028 3855 4137",
    address: "201B Nguyễn Chí Thanh, Quận 5, TP.HCM",
    mapsQuery: "Bệnh viện Chợ Rẫy TP Hồ Chí Minh",
  },
  {
    id: "mat-hcm",
    name: {
      vi: "Bệnh viện Mắt TP. Hồ Chí Minh",
      en: "Ho Chi Minh City Eye Hospital",
    },
    city: "TP. Hồ Chí Minh",
    specialty: {
      vi: "Cấp cứu Chấn thương Mắt 24/7",
      en: "24/7 Ophthalmic Emergency",
    },
    phone: "028 3932 5374",
    address: "280 Điện Biên Phủ, Quận 3, TP.HCM",
    mapsQuery: "Bệnh viện Mắt Thành phố Hồ Chí Minh",
  },
  {
    id: "da-nang",
    name: {
      vi: "Bệnh viện Đà Nẵng",
      en: "Da Nang Hospital",
    },
    city: "Đà Nẵng",
    specialty: {
      vi: "Trung tâm Cấp cứu Đa khoa Miền Trung",
      en: "Central Region Emergency Trauma",
    },
    phone: "0236 3821 118",
    address: "124 Hải Phòng, Hải Châu, Đà Nẵng",
    mapsQuery: "Bệnh viện Đà Nẵng 124 Hải Phòng",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: {
      vi: "Vì sao tuyệt đối không được bôi kem đánh răng, nước mắm hay đá lạnh lên vết bỏng pháo?",
      en: "Why should toothpaste, fish sauce, or ice NEVER be put on a firework burn?",
    },
    answer: {
      vi: "Kem đánh răng, nước mắm hay mỡ trăn giữ nhiệt bên trong mô da, làm vết bỏng sâu thêm và tăng nguy cơ nhiễm trùng nặng khiến bác sĩ khó làm sạch. Đá lạnh gây bỏng lạnh làm chết thêm tế bào. Cách đúng chuẩn y khoa duy nhất là xả nước sạch mát từ vòi (15–20°C) liên tục 15–20 phút.",
      en: "Toothpaste, oils, or sauces trap heat inside the tissue and introduce bacteria that cause severe infection. Direct ice causes vasoconstriction and frostbite injury. Only cool running tap water (15–20°C) for 15–20 minutes safely halts thermal damage.",
    },
  },
  {
    id: "faq-2",
    question: {
      vi: "Tính năng AI phân tích hình ảnh vết thương có thay thế bác sĩ chẩn đoán được không?",
      en: "Can the AI wound image analyzer replace a doctor's diagnosis?",
    },
    answer: {
      vi: "Không. Hình ảnh 2D trên điện thoại không thể đo chính xác độ sâu bỏng, tổn thương mạch máu, gân hay dị vật nằm dưới da. AI chỉ phân loại sơ bộ mức độ ưu tiên để hướng dẫn sơ cứu tạm thời trong lúc chờ cấp cứu 115 hoặc trên đường đến bệnh viện.",
      en: "No. A smartphone photo cannot measure burn depth, tendon/nerve involvement, or hidden debris. The AI provides preliminary triage orientation for temporary first aid only while you contact 115 or head to a hospital.",
    },
  },
  {
    id: "faq-3",
    question: {
      vi: "Nếu pháo xịt không nổ sau khi đốt thì xử lý thế nào cho an toàn?",
      en: "What should we do if a lit firework fails to go off (a dud)?",
    },
    answer: {
      vi: "Tuyệt đối không lại gần kiểm tra hay châm lửa lại ngay. Chờ ít nhất 20 phút ở khoảng cách an toàn, sau đó dùng xô nước đổ ngập hoàn toàn lên quả pháo trước khi dọn bỏ.",
      en: "Never approach or try to relight a dud firework. Wait at least 20 minutes at a safe distance, then douse it completely with a bucket of water before disposal.",
    },
  },
  {
    id: "faq-4",
    question: {
      vi: "Quy định pháp luật Việt Nam hiện nay về sử dụng pháo như thế nào?",
      en: "What are the current Vietnamese legal regulations on fireworks?",
    },
    answer: {
      vi: "Theo Nghị định 137/2020/NĐ-CP, người dân chỉ được phép sử dụng pháo hoa không gây tiếng nổ do Bộ Quốc phòng sản xuất hợp pháp (có hóa đơn chứng từ), nghiêm cấm tự chế, tàng trữ, mua bán và đốt pháo nổ trái phép vì nguy cơ tai nạn dập nát chi và chế tài xử phạt nghiêm khắc.",
      en: "Under Decree 137/2020/ND-CP, citizens may only use legally certified non-explosive consumer fireworks manufactured by authorized defense enterprises. Homemade or explosive firecrackers are strictly illegal due to severe blast injury risks.",
    },
  },
  {
    id: "faq-5",
    question: {
      vi: "Ảnh vết thương tôi tải lên AI có bị lưu trữ lâu dài không?",
      en: "Are wound photos I upload stored permanently?",
    },
    answer: {
      vi: "Không. Ảnh được xử lý trực tiếp theo phiên yêu cầu để trả về hướng dẫn sơ cứu và không lưu trữ trên cơ sở dữ liệu máy chủ lâu dài. Bạn cũng có thể sử dụng công cụ làm mờ/che vùng cá nhân ngay trước khi bấm Phân tích.",
      en: "No. Images are processed transiently per request for immediate first-aid guidance and are not retained in long-term server storage. You can also mask personal areas using the built-in privacy brush before sending.",
    },
  },
];
