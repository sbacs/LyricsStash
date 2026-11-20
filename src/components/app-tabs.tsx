import { NativeTabs } from 'expo-router/native-tabs';
import { useColorScheme } from 'react-native';

import { User2Icon } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
        
      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="person.fill"
          md="person"
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search" role='search'>
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="magnifyingglass"
          md="search"
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
