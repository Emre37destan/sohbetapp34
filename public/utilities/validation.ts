export const validateEmail = (email: string) => {
  if (email.trim() === '') {
    return 'E-Posta - EMail Adresiniz Gereklidir!'
  }

  if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
    return 'E-Posta - EMail Adresiniz Geçersizdir!'
  }
}

export const validateTextField = (value: string) => {
  if (value.trim() === '') {
    return 'Kullanıcı Adınız Gereklidir!'
  }

  if (/[^A-Za-z0-9_-]/.test(value)) {
    return 'Kullanıcı Adınız Yalnızca (Harf, Sayı, Tire & Alt Çizgi) Içermelidir!'
  }
}
