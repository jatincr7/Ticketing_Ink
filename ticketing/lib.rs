// Import the required modules
use ink_lang::contract;

// Define the smart contract
#[contract]
mod ticketing_platform {

    use ink_env::Env;
    use ink_storage::{
        collections::HashMap as StorageHashMap,
        lazy::Lazy,
    };
    
    // Define the concert and ticket structures
    #[derive(Debug, Clone, PartialEq, Eq, scale::Encode, scale::Decode)]
    pub struct Concert {
        name: String,
        artist: String,
        date: String,
        venue: String,
        ticket_price: u64,
        total_tickets: u64,
        remaining_tickets: u64,
    }
    
    #[derive(Debug, Clone, PartialEq, Eq, scale::Encode, scale::Decode)]
    pub struct Ticket {
        owner: Lazy<AccountId>,
        concert_name: String,
    }
    
    // Define the smart contract
    #[ink(storage)]
    pub struct TicketingPlatform {
        // A mapping of concert names to their respective Concert structs
        concerts: StorageHashMap<String, Concert>,
        // A mapping of ticket IDs to their respective Ticket structs
        tickets: StorageHashMap<u64, Ticket>,
        // A counter to keep track of the next available ticket ID
        next_ticket_id: u64,
    }
    
    impl TicketingPlatform {
        // The constructor for the smart contract
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                concerts: StorageHashMap::new(),
                tickets: StorageHashMap::new(),
                next_ticket_id: 0,
            }
        }
        
        // A method to add a new concert to the platform
        #[ink(message)]
        pub fn add_concert(
            &mut self,
            name: String,
            artist: String,
            date: String,
            venue: String,
            ticket_price: u64,
            total_tickets: u64,
        ) {
            // Check if the concert already exists
            if self.concerts.contains_key(&name) {
                ink_env::debug_println!("Concert already exists");
                return;
            }
            
            // Create a new Concert struct
            let concert = Concert {
                name: name.clone(),
                artist,
                date,
                venue,
                ticket_price,
                total_tickets,
                remaining_tickets: total_tickets,
            };
            
            // Add the concert to the storage map
            self.concerts.insert(name, concert);
        }
        
        // A method to purchase a ticket for a concert
        #[ink(message, payable)]
        pub fn buy_ticket(&mut self, concert_name: String) {
            // Check if the concert exists
            let concert = match self.concerts.get_mut(&concert_name) {
                Some(concert) => concert,
                None => {
                    ink_env::debug_println!("Concert does not exist");
                    return;
                }
            };
            
            // Check if there are any remaining tickets
            if concert.remaining_tickets == 0 {
                ink_env::debug_println!("All tickets sold out");
                return;
            }
            
            // Check if the payment amount matches the ticket price
            let ticket_price = concert.ticket_price;
            let payment = ink_env::transferred_balance::<ink_env::DefaultEnvironment>()
                .ok_or("No transfer found")?;
            if payment != ticket_price {
                ink_env::debug_println!("Incorrect payment amount");
                return;
            }
            
            // Create a new Ticket struct
            let ticket_id = self.next_ticket_id;
            let ticket = Ticket {
                owner: Lazy::from(ink_env::caller()),
                concert_name: concert_name.clone
