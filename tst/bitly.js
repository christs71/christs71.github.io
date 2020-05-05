var bitly = (

	/**
	 * Essentially a "class".
	 */
	function() {

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
//		self.initialize = async function() {
		self.initialize = function() {

			console.log( 'bitly Initialized!' );

			try {

				console.log( self[ 'fetched' ] );
				console.log( self[ 'data' ] );

//				await self.fetch();
				 self.fetch();

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
//		self.fetch = async function() {
		self.fetch = function() {

			try {

//				var groups = await self.get_groups();
				var groups = self.get_groups();

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

							// Get Bitlinks
//							self[ 'data' ][ 'groups' ][ i ][ 'bitlinks' ] = await self.get_bitlinks( group );
							self[ 'data' ][ 'groups' ][ i ][ 'bitlinks' ] = self.get_bitlinks( group );

							var bitlinks = self[ 'data' ][ 'groups' ][ i ][ 'bitlinks' ];

							if ( bitlinks[ 'length' ] >= 1 ) {

								for ( var y = 0; y < bitlinks[ 'length' ]; y ++ ) {

									var bitlink = bitlinks[ y ];

									// Get Bitlink Clicks
//									self[ 'data' ][ 'groups' ][ i ][ 'bitlinks' ][ y ][ 'clicks' ] = await self.get_clicks( bitlink );
									self[ 'data' ][ 'groups' ][ i ][ 'bitlinks' ][ y ][ 'clicks' ] = self.get_clicks( bitlink );

								}

							}

							// Get Campaigns
//							self[ 'data' ][ 'groups' ][ i ][ 'campaigns' ] = await self.get_campaigns( group );
							self[ 'data' ][ 'groups' ][ i ][ 'campaigns' ] = self.get_campaigns( group );

							var campaigns = self[ 'data' ][ 'groups' ][ i ][ 'campaigns' ];

							if ( campaigns[ 'length' ] >= 1 ) {

								for ( var x = 0; x < campaigns[ 'length' ]; x ++ ) {

									var campaign = campaigns[ x ];

									// Get Campaign Channels
//									self[ 'data' ][ 'groups' ][ i ][ 'campaigns' ][ x ][ 'channels' ] = await self.get_channels( group, campaign );
									self[ 'data' ][ 'groups' ][ i ][ 'campaigns' ][ x ][ 'channels' ] = self.get_channels( group, campaign );

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

			return new Promise( function( resolve, reject ) {

				var groups = [];

				var url = 'https://api-ssl.bitly.com/v4/groups';

				$.ajax( {
					'url': url,
					'type': 'GET',
					'contentType': 'application/json',
					'dataType': 'json',
					'beforeSend': function( xhr ) {
						xhr.setRequestHeader( 'Authorization', 'Bearer ' + self[ 'auth_token' ] );
						xhr.setRequestHeader( 'Accept', 'application/json' );
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
		 * Intended to be used to continuously fetch additional bitlinks.
		 *
		 * @param url
		 * @param bitlinks
		 * @param response
		 * @param resolve
		 * @param reject
		 */
		self.get_additional_bitlinks = function( url, bitlinks, response, resolve, reject ) {

			for ( var i = 0; i < response[ 'links' ].length; i ++ ) {
				bitlinks.push( response[ 'links' ][ i ] );
			}

			if ( response[ 'pagination' ][ 'next' ] !== '' ) {

				setTimeout( function() {

					$.ajax( {
						'url': url,
						'type': 'GET',
						'contentType': 'application/json',
						'dataType': 'json',
						'data': {
							'page': (
								response[ 'pagination' ][ 'page' ] + 1
							),
						},
						'beforeSend': function( xhr ) {
							xhr.setRequestHeader( 'Authorization', 'Bearer ' + self[ 'auth_token' ] );
							xhr.setRequestHeader( 'Accept', 'application/json' );
						},
						'success': function( response ) {

							console.log( 'success', response );

							return self.get_additional_bitlinks( url, bitlinks, response, resolve, reject );

						},
						'error': function( error ) {

							self[ 'fetched' ][ 'bitlinks' ] = false;

							console.log( 'error', error );

							reject( error );

						},
					} );

				}, 500 );

			} else {

				self[ 'fetched' ][ 'bitlinks' ] = true;

				resolve( bitlinks );

			}

		};


		/**
		 * Retrieves all Bitlinks in Group from Bitly.
		 *
		 * @param group
		 * @returns {Promise<unknown>}
		 */
		self.get_bitlinks = function( group ) {

			return new Promise( function( resolve, reject ) {

				var url = 'https://api-ssl.bitly.com/v4/groups/' + group[ 'guid' ] + '/bitlinks';

				$.ajax( {
					'url': url,
					'type': 'GET',
					'contentType': 'application/json',
					'dataType': 'json',
					'beforeSend': function( xhr ) {
						xhr.setRequestHeader( 'Authorization', 'Bearer ' + self[ 'auth_token' ] );
						xhr.setRequestHeader( 'Accept', 'application/json' );
					},
					'success': function( response ) {

						console.log( 'success', response );

						return self.get_additional_bitlinks( url, [], response, resolve, reject );

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

			return new Promise( function( resolve, reject ) {

				setTimeout( function() {

					var clicks = [];

					var url = 'https://api-ssl.bitly.com/v4/bitlinks/' + bitlink[ 'id' ] + '/clicks';

					$.ajax( {
						'url': url,
						'type': 'GET',
						'contentType': 'application/json',
						'dataType': 'json',
						'beforeSend': function( xhr ) {
							xhr.setRequestHeader( 'Authorization', 'Bearer ' + self[ 'auth_token' ] );
							xhr.setRequestHeader( 'Accept', 'application/json' );
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

			return new Promise( function( resolve, reject ) {

				var campaigns = [];

				var url = 'https://api-ssl.bitly.com/v4/campaigns';

				$.ajax( {
					'url': url,
					'type': 'GET',
					'contentType': 'application/json',
					'dataType': 'json',
					'data': {
						'group_guid': group[ 'guid' ],
					},
					'beforeSend': function( xhr ) {
						xhr.setRequestHeader( 'Authorization', 'Bearer ' + self[ 'auth_token' ] );
						xhr.setRequestHeader( 'Accept', 'application/json' );
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

			return new Promise( function( resolve, reject ) {

				setTimeout( function() {

					var channels = [];

					var url = 'https://api-ssl.bitly.com/v4/channels';

					$.ajax( {
						'url': url,
						'type': 'GET',
						'contentType': 'application/json',
						'dataType': 'json',
						'data': {
							'group_guid': group[ 'guid' ],
							'campaign_guid': campaign[ 'guid' ],
						},
						'beforeSend': function( xhr ) {
							xhr.setRequestHeader( 'Authorization', 'Bearer ' + self[ 'auth_token' ] );
							xhr.setRequestHeader( 'Accept', 'application/json' );
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

)();