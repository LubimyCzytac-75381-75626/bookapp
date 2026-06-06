package pl.vistula.bookapp.controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;
import pl.vistula.bookapp.jpa.model.Author;

import pl.vistula.bookapp.jpa.repository.AuthorRepository;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@Slf4j
@RequestMapping("/author")
public class AuthorController {

    @Autowired
    private AuthorRepository authorRepository;

    @GetMapping("/")
    List<Author> list() {
        log.info("Getting list of authors");

        return authorRepository.findAll();
    }

    @PostMapping("/save")
    public Author save(@RequestBody Author author) {
        log.info("Saving author: {}", author);

        return authorRepository.save(author);
    }

    @GetMapping("/{id}")
    ResponseEntity<Author> get(@PathVariable Long id) {
        log.info("Getting author with id: {}", id);
        return authorRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    void delete(@PathVariable Long id) {
        log.info("Deleting author with id: {}", id);
        authorRepository.deleteById(id);
    }

    @PostMapping("/{id}/photo")
    public ResponseEntity<Void> setPhoto(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
        log.info("adding author photo: {}", id);
      
        byte[] photo = file.getBytes();

        return authorRepository.findById(id)
            .map(author -> {
                author.setPhoto(photo);
                authorRepository.save(author);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().<Void>build());
    }

    @GetMapping(value = "/{id}/photo", produces = MediaType.IMAGE_PNG_VALUE)
   public ResponseEntity<byte[]> getPhoto(@PathVariable Long id) {
        log.info("get author photo: {}", id);
      
        return authorRepository.findById(id)
            .map(Author::getPhoto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/photo")
    public ResponseEntity<Void> clearCover(@PathVariable Long id) {
        log.info("deleting author photo: {}", id);
      
        return authorRepository.findById(id)
            .map(author -> {
                author.setPhoto(null);
                authorRepository.save(author);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().<Void>build());
    }
  }
