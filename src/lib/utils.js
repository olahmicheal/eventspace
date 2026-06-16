export const formatPrice = (amount, currency = 'NGN') => {
  if (currency === 'NGN') {
    return `₦${(amount / 1000).toFixed(0)}k`;
  }
  return `${currency} ${amount.toLocaleString()}`;
};

export const formatPriceFull = (amount, currency = 'NGN') => {
  if (currency === 'NGN') {
    return `₦${amount.toLocaleString()}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
};

export const getAmenityIconColor = (iconName) => {
  const colors = {
    car: '#6366F1', wifi: '#6366F1', music: '#6366F1', utensils: '#6366F1',
    snowflake: '#6366F1', monitor: '#6366F1', bed: '#6366F1', shield: '#6366F1',
    zap: '#6366F1', sun: '#6366F1', crown: '#6366F1', waves: '#6366F1',
    users: '#6366F1', wine: '#6366F1', eye: '#6366F1', headphones: '#6366F1',
    wind: '#6366F1',
  };
  return colors[iconName] || '#6366F1';
};

export const generateWhatsAppLink = (venueName) => {
  const phone = '2348000000000';
  const message = `Hi, I'm interested in booking ${venueName} through EventSpace. Can you provide more information?`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

export const generateAdminWhatsAppLink = () => {
  const phone = '2348000000000';
  const message = `Hi EventSpace Admin, I have a complaint/inquiry regarding my booking.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

export const calculateDiscount = (original, current) => {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
};