export function useTelegramSdk() {
  const mockUser = {
    firstName: 'Demo',
    lastName: 'User',
    photoUrl: undefined as string | undefined,
  };

  const haptic = {
    impactOccurred: (style: string) => {
      // no-op outside TMA
    },
    notificationOccurred: (type: string) => {
      // no-op outside TMA
    },
  };

  return {
    user: mockUser,
    themeParams: {
      bgColor: '#ffffff',
      textColor: '#000000',
      buttonColor: '#2563EB',
      buttonTextColor: '#ffffff',
      secondaryBgColor: '#F5F5F5',
      hintColor: '#999999',
    },
    haptic,
    isInTelegram: false,
    expand: () => {},
  };
}
