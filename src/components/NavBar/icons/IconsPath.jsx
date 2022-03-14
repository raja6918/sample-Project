import React from 'react';

const IconsPath = ({ icon, color }) => {
  const initial = 'scenarioIcon';
  const paths = {
    scenarioIcon: (
      <React.Fragment>
        <path
          d="M14.25,0.181818182 L21,5.58181818 L21,16.3818182 C21,17.3718182 19.9875,18.1818182 18.75,18.1818182 L5.23875,18.1818182 C4.00125,18.1818182 3,17.3718182 3,16.3818182 L3.01125,1.98181818 C3.01125,0.991818182 4.0125,0.181818182 5.25,0.181818182 L14.25,0.181818182 Z M11.0336387,13.0535113 L13.9469512,13.151755 L17.5037841,13.2742037 C18.0390802,13.2901686 18.4879509,12.8742176 18.5102246,12.337465 C18.5261895,11.8021689 18.1102385,11.3532982 17.5734859,11.3310245 L14.0166529,11.2085757 L10.9616283,5.91997754 L9.66973486,5.87933305 L10.8757304,11.1030737 L7.54650757,10.9878833 L6.62187127,9.65968247 L5.65028162,9.62483159 L6.40330059,12.8865151 L7.47534929,12.9247537 L11.0336387,13.0535113 Z M14.7,6.48181818 L19.65,6.48181818 L14.7,1.53181818 L14.7,6.48181818 Z"
          id="Shape"
          fill={color.fill}
        />
        <path
          d="M15.8221455,20.5650123 C15.5070664,21.2579742 14.8074102,21.7428668 14,21.7428668 L1.99,21.7428668 C0.89,21.7428668 0,20.8428668 0,19.7428668 L0.01,3.74286684 C0.01,2.93226795 0.493299827,2.23027577 1.18778675,1.91700634 C1.07359137,2.16909008 1.01,2.44883336 1.01,2.74286684 L1,18.7428668 C1,19.8428668 1.89,20.7428668 2.99,20.7428668 L15,20.7428668 C15.2925898,20.7428668 15.5710295,20.6791909 15.8221455,20.5650123 Z"
          id="Combined-Shape"
          fill={color.fill}
        />
      </React.Fragment>
    ),
    solverIcon: (
      <path
        d="M3.43802611,18.8581724 C3.43595678,17.8031229 4.00526385,17.1308009 4.8507222,16.9491822 C5.03105426,16.9104417 5.21561496,16.8917611 5.39648684,16.8550596 C6.07897755,16.7166492 6.36406595,16.0928728 5.99905323,15.4992613 C5.86748551,15.2852888 5.68643368,15.0975232 5.50841088,14.917074 C4.78198429,14.1807642 4.04704043,13.4527902 3.31722493,12.7197788 C3.07430298,12.4757915 2.9267204,12.1866768 3.03732486,11.8405009 C3.08983799,11.6761235 3.19165527,11.5112064 3.31305627,11.3876686 C4.14303959,10.5429033 4.98255984,9.70746337 5.82378955,8.87382252 C5.92140818,8.77712114 6.04088979,8.69568209 6.16322049,8.63208407 C6.4516978,8.48212946 6.69386998,8.5854875 6.77826287,8.8973307 C6.82621746,9.07448163 6.84874022,9.25957856 6.87081313,9.4424866 C6.97607931,10.3139384 7.60437743,11.0357355 8.45793318,11.2298579 C9.03785684,11.3617616 9.58041252,11.2258999 10.0785225,10.9186444 C10.8795351,10.4244928 11.2861145,9.69690867 11.2692899,8.75892029 C11.2536349,7.88485977 10.5359355,7.09556663 9.62290886,6.90576206 C9.43267998,6.86621195 9.23786258,6.84915052 9.04595424,6.81676681 C8.97277775,6.804443 8.89927137,6.78486285 8.83050347,6.75718676 C8.59615876,6.66288418 8.50054948,6.4677423 8.60209686,6.23814774 C8.66735589,6.09056194 8.75813672,5.9436658 8.8708705,5.82939326 C9.7061921,4.98285889 10.5473018,4.14193171 11.3921004,3.30481261 C11.807167,2.89356939 12.2976594,2.89992619 12.7158451,3.31494752 C13.4925955,4.0858599 14.2635278,4.86258937 15.0421676,5.63155273 C15.1833323,5.77098263 15.3371828,5.9058848 15.5066584,6.00684404 C16.0937497,6.3565582 16.7203084,6.07008224 16.8562247,5.40006912 C16.9007904,5.18021966 16.9227134,4.95476302 16.9808347,4.7388116 C17.3294127,3.4444524 18.8300106,3.0104806 19.8260205,3.90912876 C20.2164051,4.26133168 20.5076115,4.66453894 20.5504078,5.20840549 C20.6184859,6.07407023 20.1222953,6.78579238 19.2790863,7.01598664 C19.0729025,7.07226834 18.8578416,7.09544669 18.6474892,7.1371857 C17.8552937,7.29433668 17.5809119,8.02929715 18.1009748,8.64854579 C18.3957801,8.99957929 18.7295128,9.31855891 19.0523891,9.64536459 C19.5967442,10.1963376 20.148237,10.7402941 20.6930419,11.2908173 C20.9313454,11.5316562 21.0710405,11.8192716 20.9628652,12.1593306 C20.9119116,12.31951 20.8154326,12.4815486 20.6975705,12.6014583 C19.8604195,13.45318 19.0150511,14.2969558 18.1645844,15.1354542 C18.050441,15.2479576 17.9019587,15.3374926 17.7535964,15.4006708 C17.5292085,15.4962927 17.3232947,15.4047788 17.2495784,15.1717659 C17.1855189,14.9693077 17.1550187,14.7541959 17.1285372,14.5422924 C16.9983491,13.5011259 16.0967188,12.6975 15.0818449,12.7250861 C13.6883426,12.7629571 12.5620545,14.0699099 12.7476349,15.4337742 C12.8547604,16.2212682 13.5359916,16.9185976 14.3768614,17.0935596 C14.5670903,17.1331397 14.7618777,17.1502611 14.953726,17.1826449 C15.0269325,17.1949986 15.1004389,17.2145788 15.1692368,17.2421949 C15.4040014,17.3364675 15.4991008,17.5299602 15.3976734,17.7609941 C15.3328642,17.9087298 15.2422333,18.0558658 15.1295295,18.1701084 C14.2942979,19.0167327 13.453758,19.8581996 12.6083296,20.694659 C12.1914936,21.1070717 11.7034004,21.0997853 11.2847649,20.6844941 C10.5787617,19.9841962 9.87815685,19.2784711 9.17236363,18.5779333 C9.00237824,18.4092081 8.82717454,18.2445309 8.64318366,18.0914579 C8.4105484,17.8979352 8.13811594,17.8002143 7.83464345,17.8592846 C7.43154296,17.9377552 7.22841823,18.2191937 7.14444521,18.5991926 C7.09610074,18.8181425 7.07717683,19.0443488 7.01893554,19.2602402 C6.66795831,20.5615559 5.16151234,20.9897706 4.1625933,20.0809276 C3.72605357,19.6837773 3.43364752,19.222849 3.43802611,18.8581724"
        id="Fill-1"
        fill={color.fill}
      />
    ),
    reportsIcon: (
      <path
        d="M19,3 L14.82,3 C14.4,1.84 13.3,1 12,1 C10.7,1 9.6,1.84 9.18,3 L5,3 C3.9,3 3,3.9 3,5 L3,19 C3,20.1 3.9,21 5,21 L19,21 C20.1,21 21,20.1 21,19 L21,5 C21,3.9 20.1,3 19,3 Z M12,3 C12.55,3 13,3.45 13,4 C13,4.55 12.55,5 12,5 C11.45,5 11,4.55 11,4 C11,3.45 11.45,3 12,3 Z M14,17 L7,17 L7,15 L14,15 L14,17 Z M17,13 L7,13 L7,11 L17,11 L17,13 Z M17,9 L7,9 L7,7 L17,7 L17,9 Z"
        id="Shape"
        fill={color.fill}
        fillRule="nonzero"
      />
    ),
    settingsIcon: (
      <path
        d="M19.14,12.94 C19.18,12.64 19.2,12.33 19.2,12 C19.2,11.68 19.18,11.36 19.13,11.06 L21.16,9.48 C21.34,9.34 21.39,9.07 21.28,8.87 L19.36,5.55 C19.24,5.33 18.99,5.26 18.77,5.33 L16.38,6.29 C15.88,5.91 15.35,5.59 14.76,5.35 L14.4,2.81 C14.36,2.57 14.16,2.4 13.92,2.4 L10.08,2.4 C9.84,2.4 9.65,2.57 9.61,2.81 L9.25,5.35 C8.66,5.59 8.12,5.92 7.63,6.29 L5.24,5.33 C5.02,5.25 4.77,5.33 4.65,5.55 L2.74,8.87 C2.62,9.08 2.66,9.34 2.86,9.48 L4.89,11.06 C4.84,11.36 4.8,11.69 4.8,12 C4.8,12.31 4.82,12.64 4.87,12.94 L2.84,14.52 C2.66,14.66 2.61,14.93 2.72,15.13 L4.64,18.45 C4.76,18.67 5.01,18.74 5.23,18.67 L7.62,17.71 C8.12,18.09 8.65,18.41 9.24,18.65 L9.6,21.19 C9.65,21.43 9.84,21.6 10.08,21.6 L13.92,21.6 C14.16,21.6 14.36,21.43 14.39,21.19 L14.75,18.65 C15.34,18.41 15.88,18.09 16.37,17.71 L18.76,18.67 C18.98,18.75 19.23,18.67 19.35,18.45 L21.27,15.13 C21.39,14.91 21.34,14.66 21.15,14.52 L19.14,12.94 Z M12,15.6 C10.02,15.6 8.4,13.98 8.4,12 C8.4,10.02 10.02,8.4 12,8.4 C13.98,8.4 15.6,10.02 15.6,12 C15.6,13.98 13.98,15.6 12,15.6 Z"
        id="Shape"
        fill={color.fill}
      />
    ),
    dataIcon: (
      <React.Fragment>
        <g
          id="Group-26"
          transform="translate(2.000000, 2.000000)"
          fill={color.fill}
        >
          <g id="Group-3" transform="translate(10.000000, 14.542250)">
            <path
              d="M0.746833333,3.71591667 C0.305166667,2.65341667 0.8085,1.43425 1.87183333,0.99175 C2.9335,0.550916667 4.15266667,1.05425 4.59433333,2.11675 C5.036,3.17841667 4.53266667,4.39841667 3.47016667,4.84008333 C2.40766667,5.28175 1.1885,4.77758333 0.746833333,3.71591667"
              id="Fill-1"
            />
          </g>
          <path
            d="M6.93425,8.77966667 C7.85758333,7.18716667 9.89758333,6.6455 11.4900833,7.56883333 C13.0825833,8.49216667 13.62425,10.5321667 12.7009167,12.1246667 C11.77675,13.7171667 9.73675,14.2588333 8.14508333,13.3355 C6.55258333,12.4121667 6.01008333,10.3721667 6.93425,8.77966667 Z"
            id="Fill-4"
          />
          <polygon
            id="Fill-6"
            points="12.586 16.3343333 11.816 16.6543333 10.8568333 14.3451667 11.6268333 14.0251667"
          />
          <path
            d="M3.49258333,6.00716667 C4.20591667,6.9105 5.51591667,7.06466667 6.41925,6.3505 C7.32175,5.638 7.47508333,4.32716667 6.76258333,3.42466667 C6.04841667,2.52133333 4.73925,2.368 3.83591667,3.08133333 C2.93341667,3.79466667 2.78008333,5.10466667 3.49258333,6.00716667"
            id="Fill-8"
          />
          <polygon
            id="Fill-10"
            points="5.79241667 4.92241667 5.13825 5.43908333 6.68825 7.40075 7.34158333 6.88408333"
          />
          <path
            d="M2.857,15.5563333 C3.92533333,15.1288333 4.44533333,13.9163333 4.01866667,12.848 C3.59116667,11.7796667 2.37866667,11.2605 1.31033333,11.6871667 C0.242,12.1146667 -0.278,13.3263333 0.1495,14.3946667 C0.577,15.4638333 1.7895,15.9838333 2.857,15.5563333"
            id="Fill-12"
          />
          <polygon
            id="Fill-15"
            points="3.35425 12.5590833 3.66341667 13.3324167 5.98425 12.4040833 5.67508333 11.63075"
          />
          <path
            d="M15.1519167,3.81883333 C14.6535833,4.85633333 13.4085833,5.29383333 12.3719167,4.7955 C11.3344167,4.29716667 10.89775,3.05216667 11.39525,2.0155 C11.8944167,0.978 13.1385833,0.5405 14.17525,1.03883333 C15.21275,1.53716667 15.65025,2.78216667 15.1519167,3.81883333"
            id="Fill-17"
          />
          <polygon
            id="Fill-20"
            points="12.1408333 4.308 12.8925 4.66966667 11.8108333 6.923 11.0591667 6.56133333"
          />
          <path
            d="M17.77075,11.7339167 C16.6249167,11.8314167 15.61575,10.98225 15.51825,9.83558333 C15.42075,8.68891667 16.2699167,7.68058333 17.4165833,7.58225 C18.56325,7.48391667 19.5715833,8.33475 19.6690833,9.48058333 C19.7674167,10.62725 18.9174167,11.6364167 17.77075,11.7339167"
            id="Fill-22"
          />
          <polygon
            id="Fill-24"
            points="16.2090833 9.40316667 16.2799167 10.234 13.7890833 10.4465 13.71825 9.6165"
          />
        </g>
      </React.Fragment>
    ),
    dashboardIcon: (
      <path
        d="M3,13 L11,13 L11,3 L3,3 L3,13 Z M3,21 L11,21 L11,15 L3,15 L3,21 Z M13,21 L21,21 L21,11 L13,11 L13,21 Z M13,3 L13,9 L21,9 L21,3 L13,3 Z"
        id="Shape"
        fill={color.fill}
        fillRule="nonzero"
      />
    ),
    pairingsIcon: (
      <path
        d="M20,4 L4,4 C2.9,4 2,4.9 2,6 L2,18 C2,19.1 2.9,20 4,20 L20,20 C21.1,20 22,19.1 22,18 L22,6 C22,4.9 21.1,4 20,4 Z M4,12 L8,12 L8,14 L4,14 L4,12 Z M14,18 L4,18 L4,16 L14,16 L14,18 Z M20,18 L16,18 L16,16 L20,16 L20,18 Z M20,14 L10,14 L10,12 L20,12 L20,14 Z"
        id="Shape"
        fill={color.fill}
        fillRule="nonzero"
      />
    ),
  };

  return paths[icon] || paths[initial];
};

export default IconsPath;