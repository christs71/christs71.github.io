var bitly = window[ 'bitly' ] || {};

bitly = (

	/**
	 * Essentially a "class".
	 */
	function( $ ) {

		/**
		 *
		 * @type {{data: {groups: []}, allowed_groups: [string], auth_token: string, fetched: {channels: null, campaigns: null, groups:
		 *     null, clicks: null, bitlinks: null}}}
		 */
		var self = {
			allowed_groups: [
				'Analytics',
			],
			auth_token: '63ef42580f0dfc8517612b31d2aa1c9c37cba526',
			fetched: {
				'groups': null,
				'bitlinks': null,
				'clicks': null,
				'channels': null,
				'campaigns': null,
			},
			data: {
				'groups': [],
			},
		};

		/**
		 * Essentially a "class" constructor.
		 */
		self.initialize = async function() {

			console.log( 'bitly Initialized!' );

			try {

				console.log( self[ 'fetched' ] );
				console.log( self[ 'data' ] );

				await self.fetch();

				console.log( self[ 'fetched' ] );
				console.log( self[ 'data' ] );

			} catch ( error ) {
				console.log( error );
			}

		};


		/**
		 * Retrieves all the data from the remote source(s).
		 *
		 * @returns {Promise<boolean>}
		 */
		self.fetch = async function() {

			try {

				var groups = await self.get_groups();

				if ( groups ) {

					if ( groups[ 'length' ] >= 1 ) {

						for ( var i = 0; i < groups[ 'length' ]; i ++ ) {

							var group = groups[ i ];

							if ( self.allowed_groups.indexOf( group[ 'name' ] ) != - 1 ) {
								self[ 'data' ][ 'groups' ].push( group );
							}

						}

					}

					groups = self[ 'data' ][ 'groups' ];

					if ( groups[ 'length' ] >= 1 ) {

						for ( var i = 0; i < groups[ 'length' ]; i ++ ) {

							var group = groups[ i ];

							// Get Campaigns
							self[ 'data' ][ 'groups' ][ i ][ 'campaigns' ] = await self.get_campaigns( group );

							var campaigns = self[ 'data' ][ 'groups' ][ i ][ 'campaigns' ];

							if ( campaigns[ 'length' ] >= 1 ) {

								for ( var x = 0; x < campaigns[ 'length' ]; x ++ ) {

									var campaign = campaigns[ x ];

									// Get Campaign Channels
									self[ 'data' ][ 'groups' ][ i ][ 'campaigns' ][ x ][ 'channels' ] = await self.get_channels( group, campaign );

								}

							}

							// Get Bitlinks
							self[ 'data' ][ 'groups' ][ i ][ 'bitlinks' ] = await self.get_bitlinks( group );

							var bitlinks = self[ 'data' ][ 'groups' ][ i ][ 'bitlinks' ][ 'links' ];

							if ( bitlinks[ 'length' ] >= 1 ) {

								for ( var y = 0; y < bitlinks[ 'length' ]; y ++ ) {

									var bitlink = bitlinks[ y ];

									// Get Bitlink Clicks
									self[ 'data' ][ 'groups' ][ i ][ 'bitlinks' ][ 'links' ][ y ][ 'clicks' ] = await self.get_clicks( bitlink );

								}

							}

						}

					}

				}

				return true;

			} catch ( error ) {
				console.log( error );
			}

		};


		/**
		 * Retrieves all GHroups from Bitly.
		 *
		 * @returns {Promise<unknown>}
		 */
		self.get_groups = function() {

			return new Promise( async function( resolve, reject ) {

				var groups = [];

				$.ajax( {
					'url': 'https://api-ssl.bitly.com/v4/groups',
					'method': 'GET',
					'timeout': 0,
					'headers': {
						'Authorization': 'Bearer ' + self[ 'auth_token' ],
						'Content-Type': 'application/json',
					},
					'success': function( response ) {

						console.log( 'success', response );

						if ( response[ 'groups' ] !== undefined && Array.isArray( response[ 'groups' ] ) ) {
							groups = response[ 'groups' ];
						}

						self[ 'fetched' ][ 'groups' ] = true;

						resolve( groups );

					},
					'error': function( error ) {

						self[ 'fetched' ][ 'groups' ] = false;

						console.log( 'error', error );

						reject( error );

					},
				} );

			} );

		};


		/**
		 * Retrieves all Bitlinks in Group from Bitly.
		 *
		 * @param group
		 * @returns {Promise<unknown>}
		 */
		self.get_bitlinks = function( group ) {

			return new Promise( async function( resolve, reject ) {

				var bitlinks = [];

				$.ajax( {
					'url': 'https://api-ssl.bitly.com/v4/groups/' + group[ 'guid' ] + '/bitlinks',
					'method': 'GET',
					'timeout': 0,
					'headers': {
						'Authorization': 'Bearer ' + self[ 'auth_token' ],
						'Content-Type': 'application/json',
					},
					'success': function( response ) {

						console.log( 'success', response );

						bitlinks = response;
						self[ 'fetched' ][ 'bitlinks' ] = true;

						resolve( bitlinks );

					},
					'error': function( error ) {

						self[ 'fetched' ][ 'bitlinks' ] = false;

						console.log( 'error', error );

						reject( error );

					},
				} );

			} );

		};


		/**
		 * Retrieves all Clicks on a Bitlink from Bitly.
		 *
		 * @param bitlink
		 * @returns {Promise<unknown>}
		 */
		self.get_clicks = function( bitlink ) {

			return new Promise( async function( resolve, reject ) {

				await setTimeout( async function() {

					var clicks = [];

					$.ajax( {
						'url': 'https://api-ssl.bitly.com/v4/bitlinks/' + bitlink[ 'id' ] + '/clicks',
						'method': 'GET',
						'timeout': 0,
						'headers': {
							'Authorization': 'Bearer ' + self[ 'auth_token' ],
							'Content-Type': 'application/json',
						},
						'success': function( response ) {

							console.log( 'success', response );

							if ( response[ 'link_clicks' ] !== undefined && Array.isArray( response[ 'link_clicks' ] ) ) {
								clicks = response[ 'link_clicks' ];
							}

							self[ 'fetched' ][ 'clicks' ] = true;

							resolve( clicks );

						},
						'error': function( error ) {

							self[ 'fetched' ][ 'clicks' ] = false;

							console.log( 'error', error );

							reject( error );

						},
					} );

				}, 500 );

			} );

		};


		/**
		 * Retrieves all Campaigns in Group from Bitly.
		 *
		 * @param group
		 * @returns {Promise<unknown>}
		 */
		self.get_campaigns = function( group ) {

			return new Promise( async function( resolve, reject ) {

				var campaigns = [];

				$.ajax( {
					'url': 'https://api-ssl.bitly.com/v4/campaigns',
					'method': 'GET',
					'timeout': 0,
					'headers': {
						'Authorization': 'Bearer ' + self[ 'auth_token' ],
						'Content-Type': 'application/json',
					},
					'data': {
						'group_guid': group[ 'guid' ],
					},
					'success': function( response ) {

						console.log( 'success', response );

						if ( response[ 'campaigns' ] !== undefined && Array.isArray( response[ 'campaigns' ] ) ) {
							campaigns = response[ 'campaigns' ];
						}

						self[ 'fetched' ][ 'campaigns' ] = true;

						resolve( campaigns );

					},
					'error': function( error ) {

						self[ 'fetched' ][ 'campaigns' ] = false;

						console.log( 'error', error );

						reject( error );

					},
				} );

			} );

		};


		/**
		 * Retrieves all Campaign Channels in Group from Bitly.
		 *
		 * @param group
		 * @param campaign
		 * @returns {Promise<unknown>}
		 */
		self.get_channels = function( group, campaign ) {

			return new Promise( async function( resolve, reject ) {

				await setTimeout( async function() {

					var channels = [];

					$.ajax( {
						'url': 'https://api-ssl.bitly.com/v4/channels',
						'method': 'GET',
						'timeout': 0,
						'headers': {
							'Authorization': 'Bearer ' + self[ 'auth_token' ],
							'Content-Type': 'application/json',
						},
						'data': {
							'group_guid': group[ 'guid' ],
							'campaign_guid': campaign[ 'guid' ],
						},
						'success': function( response ) {

							console.log( 'success', response );

							if ( response[ 'channels' ] !== undefined && Array.isArray( response[ 'channels' ] ) ) {
								channels = response[ 'channels' ];
							}

							self[ 'fetched' ][ 'channels' ] = true;

							resolve( channels );

						},
						'error': function( error ) {

							self[ 'fetched' ][ 'channels' ] = false;

							console.log( 'error', error );

							reject( error );

						},
					} );

				}, 500 );

			} );

		};

		return self;

	}

)( jQuery );