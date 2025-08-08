export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'hace un momento';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `hace ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `hace ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `hace ${diffInMonths} mes${diffInMonths !== 1 ? 'es' : ''}`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `hace ${diffInYears} año${diffInYears !== 1 ? 's' : ''}`;
};

export const formatChatDateSeparator = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  
  const isSameDay = date.getDate() === now.getDate() && 
                    date.getMonth() === now.getMonth() && 
                    date.getFullYear() === now.getFullYear();
                    
  if (isSameDay) return 'HOY';
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  
  const isYesterday = date.getDate() === yesterday.getDate() && 
                      date.getMonth() === yesterday.getMonth() && 
                      date.getFullYear() === yesterday.getFullYear();
                      
  if (isYesterday) return 'AYER';
  
  // Format like "12 de Sep" or "12/09/2023"
  const options = { day: 'numeric', month: 'short' };
  if (date.getFullYear() !== now.getFullYear()) {
    options.year = 'numeric';
  }
  return date.toLocaleDateString('es-ES', options).toUpperCase();
};

export const isSameDay = (dateString1, dateString2) => {
  if (!dateString1 || !dateString2) return false;
  const d1 = new Date(dateString1);
  const d2 = new Date(dateString2);
  return d1.getDate() === d2.getDate() && 
         d1.getMonth() === d2.getMonth() && 
         d1.getFullYear() === d2.getFullYear();
};
