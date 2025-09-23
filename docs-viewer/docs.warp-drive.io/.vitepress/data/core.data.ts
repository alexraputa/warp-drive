export interface CoreTeamMember {
  name: string;
  username: string;
  title: string;
  avatar: string;
  sponsor?: string;
  links: { icon: string; link: string }[];
}

export default {
  load() {
    return [
      {
        name: 'Chris Thoburn',
        username: 'runspired',
        title: 'Project Lead | Senior Staff Engineer @auditboard',
        avatar: 'https://avatars.githubusercontent.com/u/650309?v=4',
        sponsor: 'https://github.com/sponsors/runspired',
        links: [
          { icon: 'github', link: 'https://github.com/runspired' },
          { icon: 'bluesky', link: 'https://bsky.app/profile/runspired.com' },
          { icon: 'linkedin', link: 'https://www.linkedin.com/in/runspired/' },
          { icon: 'twitter', link: 'https://twitter.com/still_runspired' },
        ],
      },
      {
        name: 'Krystan HuffMenne',
        username: 'gitKrystan',
        sponsor: 'https://github.com/sponsors/gitKrystan',
        title: 'Core Team | Staff Software Engineer @auditboard',
        avatar: 'https://avatars.githubusercontent.com/u/14152574?v=4',
        links: [{ icon: 'github', link: 'https://github.com/gitKrystan' }],
      },
      {
        name: 'Rich Glazerman',
        username: 'richgt',
        sponsor: 'https://github.com/sponsors/richgt',
        title: 'Core Team | Software Engineer @square',
        avatar: 'https://avatars.githubusercontent.com/u/1250681?v=4',
        links: [{ icon: 'github', link: 'https://github.com/richgt' }],
      },
      {
        name: 'Kirill Shaplyko',
        username: 'Baltazore',
        sponsor: 'https://github.com/sponsors/Baltazore',
        title: 'Core Team | Lead Developer @galar',
        avatar: 'https://avatars.githubusercontent.com/u/1690675?v=4',
        links: [{ icon: 'github', link: 'https://github.com/Baltazore' }],
      },
    ];
  },
};
