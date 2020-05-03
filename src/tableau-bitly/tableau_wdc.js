var tableau_wdc = window[ 'tableau_wdc' ] || {};

tableau_wdc = (

	function( $ ) {

		/**
		 *
		 * @type {{tables: {link_clicks: {}, deeplinks: {}, channels: {}, campaigns: {}, references: {}, custom_bitlinks: {}, groups: {},
		 *     links: {}, tags: {}}, columns: {link_clicks: [], deeplinks: [], channels: [], campaigns: [], references: [],
		 *     custom_bitlinks: [], groups: [], links: [], tags: []}, rows: {link_clicks: [], deeplinks: [], channels: [], campaigns: [],
		 *     references: [], custom_bitlinks: [], groups: [], links: [], tags: []}}}
		 */
		var self = {
			triggered: false,
			fetched: false,
			tables: {
				'groups': {},
				'links': {},
				'link_clicks': {},
				'custom_bitlinks': {},
				'deeplinks': {},
				'tags': {},
				'channels': {},
				'campaigns': {},
				'references': {},
			},
			columns: {
				'groups': [],
				'links': [],
				'link_clicks': [],
				'custom_bitlinks': [],
				'deeplinks': [],
				'tags': [],
				'channels': [],
				'campaigns': [],
				'references': [],
			},
			rows: {
				'groups': [],
				'links': [],
				'link_clicks': [],
				'custom_bitlinks': [],
				'deeplinks': [],
				'tags': [],
				'channels': [],
				'campaigns': [],
				'references': [],
			},
		};

		/**
		 * Essentially a "class" constructor.
		 */
		self.initialize = function() {

			console.log( 'tableau_wdc Initialized!' );
			self.do_actions();
			self.initialize_tableau();

		};


		/**
		 * Handles events.
		 */
		self.do_actions = function() {

			$( document ).ready( function() {

				$( '#submitButton' ).on( 'click', function() {

					tableau.connectionName = 'Bitly Data'; // This will be the data source name in Tableau
					tableau.submit(); // This sends the connector object to Tableau

				} );

			} );

		};


		/**
		 * Sets table columns and defines data types, etc.
		 *
		 * @returns {boolean}
		 */
		self.set_columns = function() {


			self[ 'columns' ][ 'groups' ] = [
				{
					id: 'guid',
					alias: 'id',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
				{
					id: 'name',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
				{
					id: 'is_active',
					alias: 'status',
					dataType: tableau[ 'dataTypeEnum' ][ 'bool' ],
				},
			];


			self[ 'columns' ][ 'links' ] = [
				{
					id: 'created_at',
					alias: 'date_created',
					dataType: tableau[ 'dataTypeEnum' ][ 'datetime' ],
				},
				{
					id: 'id',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
				{
					id: 'link',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
				{
					id: 'long_url',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
				{
					id: 'title',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
				{
					id: 'archived',
					alias: 'status',
					dataType: tableau[ 'dataTypeEnum' ][ 'bool' ],
				},
				{
					id: 'unit_reference',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
			];


			self[ 'columns' ][ 'link_clicks' ] = [
				{
					id: 'link_id',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
				{
					id: 'date',
					dataType: tableau[ 'dataTypeEnum' ][ 'datetime' ],
				},
				{
					id: 'clicks',
					alias: 'count',
					dataType: tableau[ 'dataTypeEnum' ][ 'int' ],
				},
			];


			self[ 'columns' ][ 'custom_bitlinks' ] = [
				{
					id: 'link_id',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
				{
					id: 'value',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
			];


			self[ 'columns' ][ 'deeplinks' ] = [
				{
					id: 'link_id',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
				{
					id: 'value',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
			];


			self[ 'columns' ][ 'tags' ] = [
				{
					id: 'link_id',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
				{
					id: 'name',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
			];


			self[ 'columns' ][ 'campaigns' ] = [
				{
					id: 'guid',
					alias: 'id',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
				{
					id: 'group_guid',
					alias: 'group_id',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
				{
					id: 'name',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
				{
					id: 'description',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
				{
					id: 'created_at',
					alias: 'date_created',
					dataType: tableau[ 'dataTypeEnum' ][ 'datetime' ],
				},
			];


			self[ 'columns' ][ 'channels' ] = [
				{
					id: 'guid',
					alias: 'id',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
				{
					id: 'group_guid',
					alias: 'group_id',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
				{
					id: 'name',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
			];


			self[ 'columns' ][ 'references' ] = [
				{
					id: 'table_name',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
				{
					id: 'table_id',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
				{
					id: 'key',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
				{
					id: 'value',
					dataType: tableau[ 'dataTypeEnum' ][ 'string' ],
				},
			];


			return true;

		};


		/**
		 * Sets table data.
		 */
		self.set_tables = function() {

			self[ 'tables' ][ 'groups' ] = {
				id: 'groups',
				columns: self[ 'columns' ][ 'groups' ],
			};

			self[ 'tables' ][ 'links' ] = {
				id: 'links',
				columns: self[ 'columns' ][ 'links' ],
			};

			self[ 'tables' ][ 'link_clicks' ] = {
				id: 'link_clicks',
				columns: self[ 'columns' ][ 'link_clicks' ],
			};

			self[ 'tables' ][ 'custom_bitlinks' ] = {
				id: 'custom_bitlinks',
				columns: self[ 'columns' ][ 'custom_bitlinks' ],
			};

			self[ 'tables' ][ 'deeplinks' ] = {
				id: 'deeplinks',
				columns: self[ 'columns' ][ 'deeplinks' ],
			};

			self[ 'tables' ][ 'references' ] = {
				id: 'references',
				columns: self[ 'columns' ][ 'references' ],
			};

			self[ 'tables' ][ 'tags' ] = {
				id: 'tags',
				columns: self[ 'columns' ][ 'tags' ],
			};

			self[ 'tables' ][ 'channels' ] = {
				id: 'channels',
				columns: self[ 'columns' ][ 'channels' ],
			};

			self[ 'tables' ][ 'campaigns' ] = {
				id: 'campaigns',
				columns: self[ 'columns' ][ 'campaigns' ],
			};

		};


		/**
		 * Download the data.
		 *
		 * @returns {Promise<boolean>}
		 */
		self.fetch_data = async function() {

			try {

				var data = [];

				if ( bitly !== undefined ) {

					self[ 'triggered' ] = true;

					await bitly.initialize(); // Basically "instantiates" the "class".
					data = bitly[ 'data' ][ 'groups' ];
					self[ 'fetched' ] = true;

				}

				self.set_rows( data );

				return true;

			} catch ( error ) {
				console.log( error );
			}

		};


		/**
		 * Sets all of the data for the tables.
		 *
		 * @param groups
		 * @returns {boolean}
		 */
		self.set_rows = function( groups ) {

			if ( groups === undefined || Array.isArray( groups ) === false ) {
				return false;
			}

			if ( groups[ 'length' ] <= 0 ) {
				return false;
			}

			for ( var g = 0; g < groups[ 'length' ]; g ++ ) {

				var group = groups[ g ];

				// do something with a Group

				self[ 'rows' ][ 'groups' ].push( {
					'guid': group[ 'guid' ],
					'name': group[ 'name' ],
					'is_active': group[ 'is_active' ],
				} );

				var campaigns = group[ 'campaigns' ];

				if ( campaigns[ 'length' ] >= 1 ) {

					for ( var ca = 0; ca < campaigns[ 'length' ]; ca ++ ) {

						var campaign = campaigns[ ca ];

						// do something with a Campaign

						self[ 'rows' ][ 'campaigns' ].push( {
							'created': campaign[ 'created' ],
							'guid': campaign[ 'guid' ],
							'group_guid': campaign[ 'group_guid' ],
							'name': campaign[ 'name' ],
							'description': campaign[ 'description' ],
						} );

						var campaign_references = campaign[ 'references' ];
						var campaign_reference_length = Object.keys( campaign_references )[ 'length' ];

						if ( campaign_reference_length > 0 ) {

							for ( var campaign_reference_key in campaign_references ) {

								var campaign_reference_value = campaign_references[ campaign_reference_key ];

								// do something with a Campaign Reference

								self[ 'rows' ][ 'references' ].push( {
									'table_name': 'campaigns',
									'table_id': campaign[ 'guid' ],
									'key': campaign_reference_key,
									'value': campaign_reference_value,
								} );

							}

						}

						var channels = campaign[ 'channels' ];

						if ( channels[ 'length' ] >= 1 ) {

							for ( var ch = 0; ch < channels[ 'length' ]; ch ++ ) {

								var channel = channels[ ch ];

								// do something with a Channel

								self[ 'rows' ][ 'channels' ].push( {
									'guid': channel[ 'guid' ],
									'group_guid': channel[ 'group_guid' ],
									'name': channel[ 'name' ],
								} );

								var channel_references = channel[ 'references' ];
								var channel_reference_length = Object.keys( channel_references )[ 'length' ];

								if ( channel_reference_length > 0 ) {

									for ( var channel_reference_key in channel_references ) {

										var channel_reference_value = channel_references[ channel_reference_key ];

										// do something with a Channel Reference

										self[ 'rows' ][ 'references' ].push( {
											'table_name': 'channels',
											'table_id': channel[ 'guid' ],
											'key': channel_reference_key,
											'value': channel_reference_value,
										} );

									}

								}

							}


						}

					}

				}

				var links = group[ 'bitlinks' ][ 'links' ];

				if ( links[ 'length' ] >= 1 ) {

					for ( var l = 0; l < links[ 'length' ]; l ++ ) {

						var link = links[ l ];

						// do something with a Link

						var link_data = {
							'created_at': link[ 'created_at' ],
							'id': link[ 'id' ],
							'link': link[ 'link' ],
							'long_url': link[ 'long_url' ],
							'title': link[ 'title' ],
							'archived': link[ 'archived' ],
						};

						var clicks = link[ 'clicks' ];

						if ( clicks[ 'length' ] >= 1 ) {

							for ( var lc = 0; lc < clicks[ 'length' ]; lc ++ ) {

								var click = clicks[ lc ];

								// do something with a Link Click

								link_data[ 'unit_reference' ] = click[ 'unit_reference' ];

								self[ 'rows' ][ 'link_clicks' ].push( {
									'link_id': link[ 'id' ],
									'date': click[ 'date' ],
									'clicks': click[ 'clicks' ], // <-- holy tongue twisters
								} );

							}

						}

						// Pushed to link rows AFTER Link clicks, because Link Clicks append Unit Reference to the Link.
						self[ 'rows' ][ 'links' ].push( link_data );

						var custom_bitlinks = link[ 'custom_bitlinks' ];

						if ( custom_bitlinks[ 'length' ] >= 1 ) {

							for ( var cb = 0; cb < custom_bitlinks[ 'length' ]; cb ++ ) {

								var custom_bitlink = custom_bitlinks[ cb ];

								// do something with a Custom Bitlink

								self[ 'rows' ][ 'custom_bitlinks' ].push( {
									'link_id': link[ 'id' ],
									'value': custom_bitlink,
								} );

							}

						}

						var deeplinks = link[ 'deeplinks' ];

						if ( deeplinks[ 'length' ] >= 1 ) {

							for ( var dl = 0; dl < deeplinks[ 'length' ]; dl ++ ) {

								var deeplink = deeplinks[ dl ];

								// do something with a Deeplink

								self[ 'rows' ][ 'deeplinks' ].push( {
									'link_id': link[ 'id' ],
									'value': deeplink,
								} );

							}

						}

						var tags = link[ 'tags' ];

						if ( tags[ 'length' ] >= 1 ) {

							for ( var t = 0; t < tags[ 'length' ]; t ++ ) {

								var tag = tags[ t ];

								// do something with a Link Tag

								self[ 'rows' ][ 'tags' ].push( {
									'link_id': link[ 'id' ],
									'name': tag,
								} );

							}

						}

						var link_references = link[ 'references' ];
						var link_reference_length = Object.keys( link_references )[ 'length' ];

						if ( link_reference_length > 0 ) {

							for ( var link_reference_key in link_references ) {

								var link_reference_value = link_references[ link_reference_key ];

								// do something with a Link Reference

								self[ 'rows' ][ 'references' ].push( {
									'table_name': 'links',
									'table_id': link[ 'guid' ],
									'key': link_reference_key,
									'value': link_reference_value,
								} );

							}

						}

					}

				}

			}

		};


		self.initialize_tableau = function() {

			console.log( 'tableau initialized!' );

			/**
			 * Create the connector object
			 */
			self[ 'connector' ] = tableau.makeConnector();

			/**
			 * Define the schema
			 */
			self[ 'connector' ].getSchema = function( schemaCallback ) {

				self.set_columns();
				self.set_tables();

				schemaCallback( Object.values( self[ 'tables' ] ) );

			};

			/**
			 * Download/Set the data to be used in Tableau.
			 */
			self[ 'connector' ].getData = function( table, doneCallback ) {

				return new Promise( async function( resolve, reject ) {

					try {

						if ( self[ 'triggered' ] === false ) {
							await self.fetch_data();
						}

						var check = setInterval( function() {

							if ( self[ 'fetched' ] === true ) {

								clearInterval( check );

								var data = [];

								if ( self[ 'rows' ][ table[ 'tableInfo' ][ 'id' ] ] !== undefined ) {
									data = self[ 'rows' ][ table[ 'tableInfo' ][ 'id' ] ];
								}

								table.appendRows( data );
								doneCallback();
								resolve( true );

							}

						}, 250 );

					} catch ( error ) {

						console.log( error );
						reject( error );

					}

				} );

			};

			tableau.registerConnector( self[ 'connector' ] );

		};

		return self;

	}

)( jQuery );

if ( tableau !== undefined && bitly !== undefined ) {
	tableau_wdc.initialize(); // Basically "instantiates" the "class".
}
